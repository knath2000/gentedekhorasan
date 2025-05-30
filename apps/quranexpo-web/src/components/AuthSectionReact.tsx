import { $authStore, $clerkStore, $userStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/react';

interface AuthSectionReactProps {
  // Props si necesitas pasar alguna configuración
}

export default function AuthSectionReact({}: AuthSectionReactProps) {
  const auth = useStore($authStore);
  const user = useStore($userStore);
  const clerk = useStore($clerkStore);

  const handleSignOut = async () => {
    if (!clerk) {
      console.error('Clerk instance not available for sign out.');
      return;
    }
    try {
      await clerk.signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    if (!clerk) {
      console.error('Clerk instance not available for sign in.');
      return;
    }
    clerk.openSignIn();
  };

  const handleSignUp = () => {
    if (!clerk) {
      console.error('Clerk instance not available for sign up.');
      return;
    }
    clerk.openSignUp();
  };

  // Loading state
  if (auth.userId === undefined || user === undefined) {
    return (
      <div className="bg-glassmorphism-strong backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Account</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-desertHighlightGold"></div>
        </div>
      </div>
    );
  }

  // Signed out state
  if (auth.userId === null || user === null) {
    return (
      <div className="bg-glassmorphism-strong backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Account</h2>
        
        <div className="space-y-3">
          <button 
            onClick={handleSignIn}
            className="w-full bg-desertHighlightGold hover:bg-desertHighlightGold/80 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
            <span>Sign In</span>
          </button>
          
          <button 
            onClick={handleSignUp}
            className="w-full bg-skyDeepBlue hover:bg-skyDeepBlue/80 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    );
  }

  // Signed in state
  return (
    <div className="bg-glassmorphism-strong backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-textPrimary mb-4">Account</h2>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar simple */}
          <div className="w-10 h-10 rounded-full bg-desertHighlightGold flex items-center justify-center text-white font-semibold">
            {user.firstName?.[0] || user.emailAddresses?.[0]?.emailAddress?.[0] || 'U'}
          </div>
          <div>
            <span className="text-textPrimary font-medium">
              {user.firstName ? `Welcome back, ${user.firstName}!` : 'Welcome back!'}
            </span>
            {user.emailAddresses?.[0] && (
              <p className="text-sm text-textSecondary">
                {user.emailAddresses[0].emailAddress}
              </p>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}