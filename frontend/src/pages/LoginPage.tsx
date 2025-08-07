import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (error) {
      // Error is handled by the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                type="email"
                className="mt-1 input-field"
                placeholder="Digite seu email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="#"
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">
                Sistema de Afiliados Automatizado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;