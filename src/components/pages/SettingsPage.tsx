import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function SettingsPage() {
  const settings = [
    {
      id: "1",
      title: "Perfil do Professor",
      description: "Editar informações pessoais",
    },
    {
      id: "2",
      title: "Critérios de Avaliação",
      description: "Configurar sistema de notas",
    },
    {
      id: "3",
      title: "Notificações",
      description: "Gerenciar alertas e lembretes",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie e visualize suas configurações</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <h3 className="text-xl font-bold text-gray mb-2">{setting.title}</h3>
            <p className="text-gray-600 mb-4">{setting.description}</p>
            <Button className="w-full">Configurar &gt;</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

