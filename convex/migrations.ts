import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration para atualizar documentos antigos que usam "name" para "nome"
export const migrateProfessorsName = mutation({
  args: {},
  handler: async (ctx) => {
    // Buscar todos os professores que ainda têm o campo "name" antigo
    const professors = await ctx.db
      .query("professors")
      .collect();

    let migrated = 0;
    for (const professor of professors) {
      // Verificar se tem "name" mas não tem "nome"
      if ((professor as any).name && !professor.nome) {
        await ctx.db.patch(professor._id, {
          nome: (professor as any).name,
        });
        migrated++;
      }
    }

    return { migrated };
  },
});

