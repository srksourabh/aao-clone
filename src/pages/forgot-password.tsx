import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      toast({
        title: "Email Sent!",
        description: "Check your inbox for password reset instructions.",
      });
    }
  };

  if (success) {
    return (
      <>
        <Head>
          <title>Check Your Email - AaoCab</title>
          <meta name="description" content="Password reset email sent" />
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base mt-2">
                We&apos;ve sent password reset instructions to:
              </CardDescription>
              <p className="font-medium text-purple-600 mt-2">{email}</p>
            </CardHeader>

            <CardContent className="text-center text-gray-600">
              <p className="mb-4">
                Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
              </p>
              <p className="text-sm">
                The link will expire in 1 hour.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
              >
                Send to a different email
              </Button>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Back to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forgot Password - AaoCab</title>
        <meta name="description" content="Reset your AaoCab account password" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-purple-600">AaoCab</span>
            </Link>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you instructions to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Link href="/login" className="flex items-center text-sm text-purple-600 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
