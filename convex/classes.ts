import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

async function getProfessorId(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const professor = await ctx.db
    .query("professors")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .unique();

  if (!professor) {
    throw new Error("Perfil de professor não encontrado");
  }

  return professor._id;
}

// Criar turma
export const createClass = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    semester: v.string(),
    year: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    return await ctx.db.insert("classes", {
      professorId,
      name: args.name,
      code: args.code,
      semester: args.semester,
      year: args.year,
      description: args.description,
    });
  },
});

// Listar turmas do professor
export const listClasses = query({
  args: {},
  handler: async (ctx) => {
    const professorId = await getProfessorId(ctx);

    return await ctx.db
      .query("classes")
      .withIndex("by_professor", (q) => q.eq("professorId", professorId))
      .collect();
  },
});

// Obter turma por ID
export const getClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const classData = await ctx.db.get(args.classId);

    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    return classData;
  },
});

// Atualizar turma
export const updateClass = mutation({
  args: {
    classId: v.id("classes"),
    name: v.string(),
    code: v.string(),
    semester: v.string(),
    year: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const classData = await ctx.db.get(args.classId);

    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    await ctx.db.patch(args.classId, {
      name: args.name,
      code: args.code,
      semester: args.semester,
      year: args.year,
      description: args.description,
    });
  },
});

// Deletar turma
export const deleteClass = mutation({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const classData = await ctx.db.get(args.classId);

    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    // Verificar se há provas associadas
    const exams = await ctx.db
      .query("exams")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();

    if (exams.length > 0) {
      throw new Error("Não é possível deletar turma com provas associadas");
    }

    await ctx.db.delete(args.classId);
  },
});
