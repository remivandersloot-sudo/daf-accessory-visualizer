import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300;
export const runtime = "nodejs";

const allowedAccessoryIds = [
  "lightbar",
  "airhorns",
  "led-logo",
  "sunvisor",
] as const;

type AccessoryId = (typeof allowedAccessoryIds)[number];

const accessoryInstructions: Record<AccessoryId, string> = {
  lightbar:
    "Use the exact lightbar from its reference image and mount it centred on the roof above the windscreen.",
  airhorns:
    "Use the exact airhorns from their reference image and mount them professionally on the roof.",
  "led-logo":
    "Use the exact illuminated DAF logo from its reference image and integrate only this logo into the front grille.",
  sunvisor:
    "Use the exact sun visor from its reference image and mount it directly above the windscreen.",
};

function isAccessoryId(value: unknown): value is AccessoryId {
  return (
    typeof value === "string" &&
    allowedAccessoryIds.includes(value as AccessoryId)
  );
}

async function loadReferenceImage(
  accessoryId: AccessoryId,
  requestUrl: string
): Promise<File> {
  const referenceUrl = new URL(
    `/accessories/${accessoryId}.png`,
    requestUrl
  );

  const response = await fetch(referenceUrl);

  if (!response.ok) {
    throw new Error(
      `Referentieafbeelding voor "${accessoryId}" kon niet worden geladen.`
    );
  }

  const imageBlob = await response.blob();

  return new File([imageBlob], `${accessoryId}.png`, {
    type: imageBlob.type || "image/png",
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "De OpenAI API-key ontbreekt." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const image = formData.get("image");
    const accessoriesRaw = formData.get("accessories");

    if (!(image instanceof File)) {
      return Response.json(
        { error: "Geen geldige truckfoto ontvangen." },
        { status: 400 }
      );
    }

    if (typeof accessoriesRaw !== "string") {
      return Response.json(
        { error: "Geen geldige accessoireselectie ontvangen." },
        { status: 400 }
      );
    }

    let parsedAccessories: unknown;

    try {
      parsedAccessories = JSON.parse(accessoriesRaw);
    } catch {
      return Response.json(
        { error: "De accessoireselectie bevat ongeldige JSON." },
        { status: 400 }
      );
    }

    if (!Array.isArray(parsedAccessories)) {
      return Response.json(
        { error: "De accessoireselectie is ongeldig." },
        { status: 400 }
      );
    }

    const accessories = parsedAccessories.filter(isAccessoryId);

    if (accessories.length === 0) {
      return Response.json(
        { error: "Selecteer minimaal één geldig accessoire." },
        { status: 400 }
      );
    }

    const referenceImages = await Promise.all(
      accessories.map((accessoryId) =>
        loadReferenceImage(accessoryId, request.url)
      )
    );

    const unselectedAccessories = allowedAccessoryIds.filter(
      (accessoryId) => !accessories.includes(accessoryId)
    );

    const referenceDescription = accessories
      .map(
        (accessory, index) =>
          `Image ${index + 2} is the exact reference image for "${accessory}".`
      )
      .join("\n");

    const selectedInstructions = accessories
      .map((accessory) => accessoryInstructions[accessory])
      .join("\n");

    const prompt = `
Image 1 is the original truck photograph.

${referenceDescription}

Perform only these selected edits:
${selectedInstructions}

Selected accessory IDs:
${accessories.join(", ")}

Do not add any accessory that was not selected.
Do not add these unselected accessories:
${unselectedAccessories.join(", ")}

In particular:
- Do not add extra roof lights, roof bars, spotlights or lightbars unless "lightbar" is selected.
- Do not add airhorns unless "airhorns" is selected.
- Do not change or add a grille logo unless "led-logo" is selected.
- Do not add or change the sun visor unless "sunvisor" is selected.

Keep the original truck, camera angle, bodywork, paint colour, branding,
background, wheels, windows, mirrors, grille and lighting unchanged.

Use the supplied reference image only for the selected accessory.
Do not copy the donor vehicle, its paint, bodywork, lighting or other parts.
Do not redesign the truck.
Do not add unrelated parts.

Produce a photorealistic visual impression with exactly the selected edits
and no other visible modifications.
`;

    const result = await openai.images.edit({
      model: "gpt-image-2",
      image: [image, ...referenceImages],
      prompt,
      size: "1536x1024",
      quality: "low",
      output_format: "jpeg",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return Response.json(
        { error: "OpenAI heeft geen afbeelding teruggestuurd." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      image: `data:image/jpeg;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("AI image edit failed:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "De visualisatie kon niet worden gemaakt.",
      },
      { status: 500 }
    );
  }
}