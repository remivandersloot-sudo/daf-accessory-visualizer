import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const maxDuration = 300;
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
const referenceImages = formData
  .getAll("referenceImages")
  .filter((item): item is File => item instanceof File);
    if (!(image instanceof File)) {
      return Response.json(
        { error: "Geen geldige truckfoto ontvangen." },
        { status: 400 }
      );
    }

    const accessories =
      typeof accessoriesRaw === "string"
        ? JSON.parse(accessoriesRaw)
        : [];

    const accessoryInstructions: Record<string, string> = {
  lightbar:
    "Use the exact lightbar from its reference image and mount it centred on the roof above the windscreen.",
  airhorns:
    "Use the exact airhorns from their reference image and mount them professionally on the roof.",
  "led-logo":
    "Use the exact illuminated DAF logo from its reference image and integrate only this logo into the front grille.",
  sunvisor:
    "Use the exact sun visor from its reference image and mount it directly above the windscreen.",
};

const allAccessoryIds = [
  "lightbar",
  "airhorns",
  "led-logo",
  "sunvisor",
];

const unselectedAccessories = allAccessoryIds.filter(
  (accessoryId) => !accessories.includes(accessoryId)
);

const referenceDescription = accessories
  .map(
    (accessory: string, index: number) =>
      `Image ${index + 2} is the exact reference image for "${accessory}".`
  )
  .join("\n");

const selectedInstructions = accessories
  .map(
    (accessory: string) =>
      accessoryInstructions[accessory] ?? `Add only "${accessory}".`
  )
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
      image:
  referenceImages.length > 0
    ? [image, ...referenceImages]
    : image,
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