import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { signInWithGooglePopup, signInWithFacebookPopup } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      // 1. Open Firebase Google popup and get idToken
      const { idToken, result } = await signInWithGooglePopup();
      const user = result.user;
      
      // 2. Send idToken to backend to exchange for app session
      const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          idToken,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Google sign-in failed');
      }

      const data = await response.json();
      
      // 3. Store returned app token and reload to update auth state
      // Backend returns { success, data: { user, accessToken }, message }
      const accessToken = data?.data?.accessToken || data?.accessToken || data?.token;
      const userData = data?.data?.user || data?.user;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (userData) {
          localStorage.setItem('auth_user_v2', JSON.stringify(userData));
        }
        window.location.href = '/'; // Redirect to home after successful login
      } else {
        throw new Error('No access token received from server');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      // 1. Open Firebase Facebook popup and get idToken
      const { idToken, result } = await signInWithFacebookPopup();
      const user = result.user;
      
      // 2. Send idToken to backend to exchange for app session
      const response = await fetch(`${API_BASE_URL}/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'facebook',
          idToken,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Facebook sign-in failed');
      }

      const data = await response.json();
      
      // 3. Store returned app token and reload to update auth state
      // Backend returns { success, data: { user, accessToken }, message }
      const accessToken = data?.data?.accessToken || data?.accessToken || data?.token;
      const userData = data?.data?.user || data?.user;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        if (userData) {
          localStorage.setItem('auth_user_v2', JSON.stringify(userData));
        }
        window.location.href = '/'; // Redirect to home after successful login
      } else {
        throw new Error('No access token received from server');
      }
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      alert(error.message || 'Failed to sign in with Facebook');
    } finally {
      setIsFacebookLoading(false);
    }
  };

  return (
    <div className="gap-2 flex items-center ">
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isFacebookLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FcGoogle className="mr-1 sm:mr-2.5 h-4 w-3"/>
        )}
        {isGoogleLoading ? 'Signing in...' : 'Google'}
      </Button>
      <Button
        type="button"
        className="w-full h-10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        onClick={handleFacebookLogin}
        disabled={isGoogleLoading || isFacebookLoading}
      >
        {isFacebookLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaFacebookF className="mr-1 sm:mr-2.5 h-4 w-3 text-[#1873eb]" />
        )}
        {isFacebookLoading ? 'Signing in...' : 'Facebook'}
      </Button>
    </div>
  );
}
