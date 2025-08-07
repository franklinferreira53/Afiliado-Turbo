import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  ColorSwatchIcon,
  MicrophoneIcon,
  ClockIcon,
  DeviceMobileIcon,
  KeyIcon,
  SaveIcon,
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [preferences, setPreferences] = useState({
    voice_preference: user?.settings?.voice_preference || 'female',
    content_frequency: user?.settings?.content_frequency || 3,
    preferred_platforms: user?.settings?.preferred_platforms || ['instagram', 'facebook'],
    categories: user?.settings?.categories || ['electronics', 'home'],
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_reports: true,
    performance_alerts: true,
  });

  const voiceOptions = [
    { value: 'male', label: 'Voz Masculina', icon: '👨' },
    { value: 'female', label: 'Voz Feminina', icon: '👩' },
  ];

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', color: 'pink' },
    { value: 'facebook', label: 'Facebook', color: 'blue' },
    { value: 'tiktok', label: 'TikTok', color: 'gray' },
    { value: 'whatsapp', label: 'WhatsApp', color: 'green' },
  ];

  const categoryOptions = [
    'electronics', 'home', 'beauty', 'sports', 'toys', 'books', 'clothing', 'health'
  ];

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call - in real app would call auth service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user!,
        name: profile.name,
        email: profile.email,
      };
      
      updateUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      // Mock API call - in real app would call auth service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user!,
        settings: {
          ...user?.settings,
          ...preferences,
        },
      };
      
      updateUser(updatedUser);
      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = preferences.preferred_platforms.includes(platform)
      ? preferences.preferred_platforms.filter(p => p !== platform)
      : [...preferences.preferred_platforms, platform];
    
    setPreferences({ ...preferences, preferred_platforms: newPlatforms });
  };

  const toggleCategory = (category: string) => {
    const newCategories = preferences.categories.includes(category)
      ? preferences.categories.filter(c => c !== category)
      : [...preferences.categories, category];
    
    setPreferences({ ...preferences, categories: newCategories });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-gray-600">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body">
              <nav className="space-y-1">
                {[
                  { name: 'Perfil', icon: UserIcon, current: true },
                  { name: 'Preferências', icon: CogIcon, current: false },
                  { name: 'Notificações', icon: BellIcon, current: false },
                  { name: 'Segurança', icon: ShieldCheckIcon, current: false },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${item.current
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Informações do Perfil
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>{isLoading ? 'Salvando...' : 'Salvar Perfil'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Preferences */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ColorSwatchIcon className="w-5 h-5 mr-2" />
                Preferências de Conteúdo
              </h3>
            </div>
            <div className="card-body space-y-6">
              {/* Voice Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MicrophoneIcon className="w-4 h-4 inline mr-1" />
                  Preferência de Voz para Narração
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {voiceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPreferences({ ...preferences, voice_preference: option.value as any })}
                      className={`
                        p-3 rounded-lg border text-left transition-colors
                        ${preferences.voice_preference === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Frequência de Conteúdo (posts por dia)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={preferences.content_frequency}
                  onChange={(e) => setPreferences({ ...preferences, content_frequency: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 post</span>
                  <span className="font-medium">{preferences.content_frequency} posts</span>
                  <span>10 posts</span>
                </div>
              </div>

              {/* Platform Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <DeviceMobileIcon className="w-4 h-4 inline mr-1" />
                  Plataformas Preferidas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => togglePlatform(platform.value)}
                      className={`
                        p-3 rounded-lg border text-left transition-colors
                        ${preferences.preferred_platforms.includes(platform.value)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="font-medium">{platform.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorias de Interesse
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${preferences.categories.includes(category)
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={savePreferences}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>{isLoading ? 'Salvando...' : 'Salvar Preferências'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BellIcon className="w-5 h-5 mr-2" />
                Configurações de Notificação
              </h3>
            </div>
            <div className="card-body space-y-4">
              {[
                { key: 'email_notifications', label: 'Notificações por Email', description: 'Receber atualizações importantes por email' },
                { key: 'push_notifications', label: 'Notificações Push', description: 'Receber notificações no navegador' },
                { key: 'weekly_reports', label: 'Relatórios Semanais', description: 'Receber resumo semanal de performance' },
                { key: 'performance_alerts', label: 'Alertas de Performance', description: 'Ser notificado sobre mudanças significativas' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => setNotifications({
                      ...notifications,
                      [setting.key]: !notifications[setting.key as keyof typeof notifications]
                    })}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications[setting.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-gray-200'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${notifications[setting.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Segurança
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Alterar Senha</div>
                    <div className="text-sm text-gray-600">Última alteração: há 30 dias</div>
                  </div>
                  <button className="btn-secondary flex items-center space-x-2">
                    <KeyIcon className="w-4 h-4" />
                    <span>Alterar</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">Autenticação de Dois Fatores</div>
                    <div className="text-sm text-gray-600">Adicione uma camada extra de segurança</div>
                  </div>
                  <button className="btn-secondary">
                    Configurar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;