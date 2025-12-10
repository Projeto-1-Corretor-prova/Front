import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Professor (conforme UML: Nome, Senha)
  // Senha é gerenciada pelo auth, mantemos userId
  // Temporariamente aceita "name" para compatibilidade durante migração
  professors: defineTable({
    userId: v.id("users"),
    nome: v.optional(v.string()), // Nome conforme UML (temporariamente opcional para migração)
    name: v.optional(v.string()), // Campo antigo (temporário para migração)
    email: v.string(),
    institution: v.optional(v.string()),
    department: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Turma (conforme UML: Titulo)
  classes: defineTable({
    professorId: v.id("professors"),
    titulo: v.string(), // Titulo conforme UML
  }).index("by_professor", ["professorId"]),

  // Aluno (conforme UML: Nome, Identificador)
  students: defineTable({
    classId: v.id("classes"),
    nome: v.string(), // Nome conforme UML
    identificador: v.string(), // Identificador conforme UML
  }).index("by_class", ["classId"])
    .index("by_identifier", ["identificador"]),

  // BancaQuestao (conforme UML: Titulo)
  questionBanks: defineTable({
    professorId: v.id("professors"),
    titulo: v.string(), // Titulo conforme UML
  }).index("by_professor", ["professorId"]),

  // Prova (conforme UML: Titulo, Campo_Identificador, Peso)
  exams: defineTable({
    classId: v.id("classes"),
    titulo: v.string(), // Titulo conforme UML
    campoIdentificador: v.string(), // Campo_Identificador conforme UML
    peso: v.number(), // Peso conforme UML (Float)
  }).index("by_class", ["classId"]),

  // Questão (conforme UML: Identificador, Enunciado, Peso, Linhas)
  questions: defineTable({
    questionBankId: v.id("questionBanks"),
    identificador: v.string(), // Identificador conforme UML
    enunciado: v.string(), // Enunciado conforme UML
    peso: v.number(), // Peso conforme UML (Float)
    linhas: v.number(), // Linhas conforme UML (Int)
  }).index("by_question_bank", ["questionBankId"]),

  // Tabela de junção para relação many-to-many Prova-Questão
  examQuestions: defineTable({
    examId: v.id("exams"),
    questionId: v.id("questions"),
  }).index("by_exam", ["examId"])
    .index("by_question", ["questionId"]),

  // Critério de Questão (conforme UML: Regra, Tipo)
  questionCriteria: defineTable({
    questionId: v.id("questions"),
    regra: v.string(), // Regra conforme UML
    tipo: v.union(v.literal("PALAVRA CHAVE"), v.literal("SEMANTICO")), // Tipo conforme ENUMCRITERIO
  }).index("by_question", ["questionId"]),

  // Correcao (conforme UML: Titulo, Pontuacao)
  corrections: defineTable({
    examId: v.id("exams"),
    studentId: v.id("students"),
    titulo: v.string(), // Titulo conforme UML
    pontuacao: v.number(), // Pontuacao conforme UML (Float)
  }).index("by_exam", ["examId"])
    .index("by_student", ["studentId"]),

  // Resposta (conforme UML: ComentáriosDalA, ComentáriosDoProfessor, Pontuacao)
  answers: defineTable({
    questionId: v.id("questions"),
    correctionId: v.id("corrections"),
    comentariosDalA: v.string(), // ComentáriosDalA conforme UML
    comentariosDoProfessor: v.optional(v.string()), // ComentáriosDoProfessor conforme UML
    pontuacao: v.number(), // Pontuacao conforme UML (Float)
  }).index("by_question", ["questionId"])
    .index("by_correction", ["correctionId"]),

  // Mantendo tabelas antigas para compatibilidade durante migração
  // TODO: Remover após migração completa
  studentSubmissions: defineTable({
    examId: v.id("exams"),
    studentName: v.string(),
    studentId: v.string(),
    submissionDate: v.number(),
    fileId: v.optional(v.id("_storage")),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("error")),
  }).index("by_exam", ["examId"]),

  studentAnswers: defineTable({
    submissionId: v.id("studentSubmissions"),
    questionId: v.id("questions"),
    answerText: v.string(),
    aiScore: v.optional(v.number()),
    aiComments: v.optional(v.string()),
    manualScore: v.optional(v.number()),
    manualComments: v.optional(v.string()),
    finalScore: v.number(),
  }).index("by_submission", ["submissionId"])
    .index("by_question", ["questionId"]),

  plagiarismDetection: defineTable({
    examId: v.id("exams"),
    questionId: v.id("questions"),
    student1Id: v.id("studentSubmissions"),
    student2Id: v.id("studentSubmissions"),
    similarityScore: v.number(),
    suspiciousText: v.string(),
    status: v.union(v.literal("flagged"), v.literal("reviewed"), v.literal("dismissed")),
  }).index("by_exam", ["examId"])
    .index("by_question", ["questionId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
