export type EditableBlockType = "heading" | "paragraph";

export type EditableBlock = {
  id: string;
  type: EditableBlockType;
  text: string;
};

export function normalizeEditableBlocks(value: unknown): EditableBlock[] {
  if (!Array.isArray(value) || value.length > 40) {
    throw new Error("O conteúdo precisa ter até 40 blocos estruturados.");
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`O bloco ${index + 1} é inválido.`);
    }

    const block = item as Record<string, unknown>;
    const type = block.type;
    const text = typeof block.text === "string" ? block.text.trim() : "";
    const id = typeof block.id === "string" && block.id.length <= 80 ? block.id : `block-${index + 1}`;

    if ((type !== "heading" && type !== "paragraph") || text.length === 0 || text.length > 8000) {
      throw new Error(`O bloco ${index + 1} tem tipo ou texto inválido.`);
    }

    return { id, type, text };
  });
}
