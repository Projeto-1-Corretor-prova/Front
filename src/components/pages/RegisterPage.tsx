import { useState, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";

export function RegisterPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Resetar submitting quando autenticado
  useEffect(() => {
    if (isAuthenticated && submitting) {
      setSubmitting(false);
      toast.success("Conta criada com sucesso! Complete seu perfil.");
      // O App.tsx vai redirecionar automaticamente para ProfileSetup se não houver perfil
      // Forçar navegação para garantir que o estado seja atualizado
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    }
  }, [isAuthenticated, submitting, navigate]);

  // Timeout de segurança para resetar submitting
  useEffect(() => {
    if (submitting) {
      const timeout = setTimeout(() => {
        if (submitting) {
          setSubmitting(false);
          toast.error("Tempo de espera excedido. Tente novamente.");
        }
      }, 30000); // 30 segundos

      return () => clearTimeout(timeout);
    }
  }, [submitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.set("email", formData.email);
    formDataObj.set("password", formData.password);
    formDataObj.set("flow", "signUp");

    // signIn não retorna uma Promise que resolve quando bem-sucedido
    // Ele atualiza o estado através do React Context
    // Por isso usamos useConvexAuth para monitorar mudanças
    void signIn("password", formDataObj).catch((error: any) => {
      console.error("Erro no registro:", error);
      let toastTitle = "";
      const errorMessage = error?.message || String(error) || "";
      if (errorMessage.includes("already exists") || errorMessage.includes("já existe") || errorMessage.includes("duplicate")) {
        toastTitle = "Este email já está cadastrado. Faça login.";
      } else if (errorMessage.includes("Invalid") || errorMessage.includes("inválid")) {
        toastTitle = "Dados inválidos. Verifique o email e senha.";
      } else {
        toastTitle = "Erro ao criar conta. Tente novamente.";
      }
      toast.error(toastTitle);
      setSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-blue flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Dark Blue Card */}
        <div className="bg-gray text-white rounded-xl p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="mb-8">
              <Logo size="md" showText={true} className="text-white" />
            </div>

            {/* Welcome Message */}
            <h1 className="text-4xl font-bold mb-4">Crie sua conta!</h1>
            <p className="text-gray-300 mb-8">
              Junte-se a milhares de professores que já economizam tempo com correções automáticas.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon />
                </div>
                <div>
                  <div className="font-semibold mb-1">Cadastro Gratuito</div>
                  <div className="text-gray-300 text-sm">
                    Comece a usar imediatamente sem custos
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon />
                </div>
                <div>
                  <div className="font-semibold mb-1">Correção Automática</div>
                  <div className="text-gray-300 text-sm">
                    IA avançada para correção de provas
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon />
                </div>
                <div>
                  <div className="font-semibold mb-1">Relatórios Detalhados</div>
                  <div className="text-gray-300 text-sm">
                    Análises completas do desempenho dos alunos
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">5.000+</div>
              <div className="text-gray-300 text-sm">Professores ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">150k+</div>
              <div className="text-gray-300 text-sm">Provas corrigidas</div>
            </div>
          </div>
        </div>

        {/* Right Section - White Card with Form */}
        <div className="bg-white rounded-xl p-8 shadow-xl">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray mb-2">Criar Conta</h2>
            <p className="text-gray-600 mb-8">
              Preencha os dados abaixo para criar sua conta
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-12 py-3 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Digite a senha novamente"
                    className="w-full pl-10 pr-12 py-3 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 text-lg"
                disabled={submitting}
              >
                {submitting ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Já tem uma conta? </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue hover:text-blue-hover font-medium text-sm"
              >
                Faça login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

