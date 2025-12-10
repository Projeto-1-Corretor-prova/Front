import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { DocumentIcon, UsersIcon, ChartIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";
import { ArrowRightIcon } from "../ui/ArrowRightIcon";
import { SignInForm } from "../../SignInForm";
import Footer from "../layout/Footer";

interface LandingPageProps {
  onShowLogin?: () => void;
}

export function LandingPage({ onShowLogin }: LandingPageProps) {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  
  const handleLoginClick = () => {
    if (onShowLogin) {
      onShowLogin();
    } else {
      navigate("/login");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" showText={true} className="text-white" />
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            {/* Logo */}
            <div className="mb-8">
              <Logo size="lg" showText={true} />
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold text-gray mb-6">
              Simplifique a correção de provas
            </h1>

            {/* Sub-headline */}
            <p className="text-xl text-gray-600 mb-8">
              Economize tempo, melhore a organização e tenha insights valiosos sobre o desempenho dos seus alunos.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-12">
            <Button 
              className="px-8 py-4 text-lg flex items-center gap-2"
              onClick={handleRegisterClick}
            >
              Criar Conta Grátis
              <ArrowRightIcon />
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-4 text-lg"
              onClick={handleLoginClick}
            >
              Fazer Login
            </Button>
            </div>

            {/* Statistics */}
            <div className="flex gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-blue mb-3">5.000+</div>
                <div className="text-gray-600">Professores ativos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue mb-3">150k+</div>
                <div className="text-gray-600">Provas corrigidas</div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="relative mt-20">
              {/* Blue decorative background - larger, behind the card, rotated */}
              <div className="absolute -left-8 -top-8 w-[calc(100%+4rem)] h-[calc(100%+4rem)] bg-blue rounded-xl transform rotate-3 z-0"></div>
              
              {/* White card with slight tilt and shadow */}
              <div className="relative bg-white rounded-lg p-6 shadow-xl transform -rotate-1 z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentIcon className="text-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray mb-2">Prova de Matemática</h3>
                    <p className="text-gray-600 mb-4">30 alunos • 85% concluído</p>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray">Progresso</span>
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-lighter py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray mb-4">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="text-xl text-gray-600">
                Recursos poderosos para transformar sua rotina de correções
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Card 1 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <DocumentIcon className="text-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Gestão de Provas</h3>
                <p className="text-gray-600">
                  Crie, organize e gerencie todas as suas avaliações em um só lugar
                </p>
              </Card>

              {/* Feature Card 2 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <UsersIcon className="text-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Controle de Turmas</h3>
                <p className="text-gray-600">
                  Administre múltiplas turmas e acompanhe o desempenho individual
                </p>
              </Card>

              {/* Feature Card 3 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-blue">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Correção Rápida</h3>
                <p className="text-gray-600">
                  Acelere o processo de correção com ferramentas inteligentes
                </p>
              </Card>

              {/* Feature Card 4 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <ChartIcon className="text-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Relatórios Detalhados</h3>
                <p className="text-gray-600">
                  Análises completas do desempenho dos alunos e turmas
                </p>
              </Card>

              {/* Feature Card 5 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-blue">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Segurança Total</h3>
                <p className="text-gray-600">
                  Seus dados protegidos com criptografia de ponta
                </p>
              </Card>

              {/* Feature Card 6 */}
              <Card>
                <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-blue">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray mb-2">Interface Rápida</h3>
                <p className="text-gray-600">
                  Sistema otimizado para máxima produtividade
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray mb-4">
                Escolha o plano ideal para você
              </h2>
              <p className="text-xl text-gray-600">
                Comece grátis e faça upgrade quando precisar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <Card className="relative">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray mb-2">Básico</h3>
                  <div className="text-4xl font-bold text-gray">Grátis</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">1 turma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Até 30 alunos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Correções ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Relatórios básicos</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={handleRegisterClick}>
                  Começar Agora
                </Button>
              </Card>

              {/* Professional Plan */}
              <Card className="relative border-2 border-blue">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue text-white px-4 py-1 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
                <div className="text-center mb-6 mt-4">
                  <h3 className="text-2xl font-bold text-gray mb-2">Profissional</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray">R$ 49,90</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Turmas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Alunos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Correções ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Relatórios avançados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Backup automático</span>
                  </li>
                </ul>
                <Button className="w-full" onClick={handleRegisterClick}>
                  Começar Agora
                </Button>
              </Card>

              {/* Institutional Plan */}
              <Card>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray mb-2">Institucional</h3>
                  <div className="text-4xl font-bold text-gray">Sob consulta</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Tudo do Profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Multi-professores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">API personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Suporte dedicado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-blue flex-shrink-0">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                    </svg>
                    <span className="text-gray-600">Treinamento incluído</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => setShowSignIn(true)}>
                  Entre em Contato
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray mb-4">
                O que os professores dizem
              </h2>
              <p className="text-xl text-gray-600">
                Milhares de educadores já confiam no Corrija+
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <Card className="bg-gray-lighter">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fill="#FCD34D"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "O Corrija+ revolucionou minha forma de trabalhar. Economizo horas toda semana!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div>
                    <div className="font-bold text-gray">Ana Silva</div>
                    <div className="text-sm text-gray-600">Professora de Matemática</div>
                  </div>
                </div>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-gray-lighter">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fill="#FCD34D"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Conseguimos melhorar significativamente o acompanhamento dos alunos."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center text-white font-bold">
                    CM
                  </div>
                  <div>
                    <div className="font-bold text-gray">Carlos Mendes</div>
                    <div className="text-sm text-gray-600">Coordenador Pedagógico</div>
                  </div>
                </div>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-gray-lighter">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fill="#FCD34D"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "Interface intuitiva e funcionalidades que realmente fazem diferença no dia a dia."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <div className="font-bold text-gray">Maria Santos</div>
                    <div className="text-sm text-gray-600">Professora de Português</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-blue py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para transformar suas correções?
            </h2>
            <p className="text-xl text-white mb-8">
              Junte-se a milhares de professores que já otimizaram seu tempo
            </p>
            <Button 
              className="bg-white text-blue px-8 py-4 text-lg flex items-center gap-2 mx-auto hover:bg-gray-lighter"
              onClick={handleRegisterClick}
            >
              Começar Gratuitamente
              <ArrowRightIcon />
            </Button>
            <p className="text-white text-sm mt-4">
              Não precisa cartão de crédito
            </p>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray mb-4">Entrar no Corrija+</h2>
            <SignInForm />
          </div>
        </div>
      )}
    </div>
  );
}
