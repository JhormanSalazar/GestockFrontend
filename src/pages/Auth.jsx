import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { GestockLogo } from "@/components/GestockLogo";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1); // 1: Email/Password, 2: BusinessName
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const navigate = useNavigate();

  const { loginMutation, registerMutation, isAuthenticated, isLoggingIn, isRegistering } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast({
            title: "Bienvenido",
            description: "Has iniciado sesión correctamente",
          });
          navigate("/");
        },
        onError: (error) => {
          toast({
            title: "Error al iniciar sesión",
            description: error.message || "Credenciales inválidas",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleRegistrationStep1 = (e) => {
    e.preventDefault();
    // Validar email y password antes de continuar
    if (!email || !password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Avanzar al paso 2
    setRegistrationStep(2);
  };

  const handleRegistrationStep2 = async (e) => {
    e.preventDefault();

    if (!businessName || businessName.trim().length === 0) {
      toast({
        title: "Nombre del negocio requerido",
        description: "Por favor ingresa el nombre de tu negocio",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(
      { businessName: businessName.trim(), email, password },
      {
        onSuccess: () => {
          toast({
            title: "Cuenta creada",
            description: "Tu cuenta y negocio han sido creados exitosamente. Puedes iniciar sesión ahora.",
          });
          // Limpiar formulario y volver a login
          setEmail("");
          setPassword("");
          setBusinessName("");
          setRegistrationStep(1);
          setIsLogin(true);
        },
        onError: (error) => {
          toast({
            title: "Error al crear cuenta",
            description: error.message || "No se pudo crear la cuenta",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleBackToStep1 = () => {
    setRegistrationStep(1);
    setBusinessName("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setRegistrationStep(1);
    setEmail("");
    setPassword("");
    setBusinessName("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-effect">
            <GestockLogo className="h-30 w-30" fill="white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Gestock</h1>
          <p className="text-muted-foreground text-center">
            Sistema de gestión de inventarios
          </p>
        </div>

        {/* Form */}
        <Card className="glass-card p-8 border-border/50">
          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </form>
          )}

          {/* Registration Form - Step 1: Email & Password */}
          {!isLogin && registrationStep === 1 && (
            <form onSubmit={handleRegistrationStep1} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Paso 1 de 2</Label>
                  <span className="text-xs text-muted-foreground">Credenciales</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Continuar
              </Button>
            </form>
          )}

          {/* Registration Form - Step 2: Business Name */}
          {!isLogin && registrationStep === 2 && (
            <form onSubmit={handleRegistrationStep2} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Paso 2 de 2</Label>
                  <span className="text-xs text-muted-foreground">Información del negocio</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del negocio</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Mi Empresa S.A."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="bg-background/50"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Este será el nombre de tu negocio en el sistema
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Creando cuenta..." : "Crear cuenta"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToStep1}
                  disabled={isRegistering}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
