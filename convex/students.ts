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

// Criar aluno
export const createStudent = mutation({
  args: {
    classId: v.id("classes"),
    nome: v.string(),
    identificador: v.string(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(args.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    // Verificar se já existe aluno com mesmo identificador na turma
    const existing = await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .filter((q) => q.eq(q.field("identificador"), args.identificador))
      .first();

    if (existing) {
      throw new Error("Já existe um aluno com este identificador nesta turma");
    }

    return await ctx.db.insert("students", {
      classId: args.classId,
      nome: args.nome,
      identificador: args.identificador,
    });
  },
});

// Listar alunos de uma turma
export const listStudents = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(args.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Turma não encontrada");
    }

    return await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

// Listar todos os alunos do professor
export const listAllStudents = query({
  args: {},
  handler: async (ctx) => {
    const professorId = await getProfessorId(ctx);

    // Buscar todas as turmas do professor
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_professor", (q) => q.eq("professorId", professorId))
      .collect();

    // Buscar alunos de todas as turmas
    const allStudents = await Promise.all(
      classes.map(async (classItem) => {
        const students = await ctx.db
          .query("students")
          .withIndex("by_class", (q) => q.eq("classId", classItem._id))
          .collect();
        return students.map((student) => ({
          ...student,
          classTitle: classItem.titulo,
        }));
      })
    );

    return allStudents.flat();
  },
});

// Obter aluno por ID
export const getStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const student = await ctx.db.get(args.studentId);

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(student.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Aluno não encontrado");
    }

    return student;
  },
});

// Atualizar aluno
export const updateStudent = mutation({
  args: {
    studentId: v.id("students"),
    nome: v.string(),
    identificador: v.string(),
  },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const student = await ctx.db.get(args.studentId);

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(student.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Aluno não encontrado");
    }

    // Verificar se já existe outro aluno com mesmo identificador na turma
    const existing = await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", student.classId))
      .filter((q) => 
        q.and(
          q.eq(q.field("identificador"), args.identificador),
          q.neq(q.field("_id"), args.studentId)
        )
      )
      .first();

    if (existing) {
      throw new Error("Já existe um aluno com este identificador nesta turma");
    }

    await ctx.db.patch(args.studentId, {
      nome: args.nome,
      identificador: args.identificador,
    });
  },
});

// Deletar aluno
export const deleteStudent = mutation({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const professorId = await getProfessorId(ctx);
    const student = await ctx.db.get(args.studentId);

    if (!student) {
      throw new Error("Aluno não encontrado");
    }

    // Verificar se a turma pertence ao professor
    const classData = await ctx.db.get(student.classId);
    if (!classData || classData.professorId !== professorId) {
      throw new Error("Aluno não encontrado");
    }

    // Verificar se há correções associadas
    const corrections = await ctx.db
      .query("corrections")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    if (corrections.length > 0) {
      throw new Error("Não é possível deletar aluno com correções associadas");
    }

    await ctx.db.delete(args.studentId);
  },
});

