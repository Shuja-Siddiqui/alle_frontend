"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RolePageLayout } from "../../../../components/RolePageLayout";
import { EduPortal } from "../../../../components/EduPortal";
import { InputField } from "../../../../components/InputField";
import { SelectField } from "../../../../components/SelectField";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { AddAvatar } from "../../../../components/AddAvatar";
import { SelectAvatarDialog } from "../../../../components/SelectAvatarDialog";
import { MascotCreation } from "../../../../components/MascotCreation";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUI } from "../../../../contexts/UIContext";
import { useApiPost } from "../../../../hooks/useApi";

export default function StudentSignupPage() {
  return <StudentSignupContent />;
}

function StudentSignupContent() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess, showError, showLoader, hideLoader } = useUI();
  const { loading: apiLoading, post, error: apiError } = useApiPost();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [languageSelected, setLanguageSelected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showMascotCreation, setShowMascotCreation] = useState(false);
  const [mascotParts, setMascotParts] = useState<{
    face: string;
    hair: string;
    body: string;
  }>({
    face: "head1",
    hair: "hair1",
    body: "body1",
  });

  // Store user data after account creation
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Step 0: Language selection (before signup)
  const handleLanguageContinue = () => {
    if (!selectedLanguage) {
      showError('Please select a language');
      return;
    }
    
    console.log('✅ Step 0: Language selected:', selectedLanguage);
    setLanguageSelected(true);
  };

  // Step 1: Create user account with basic info + language
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      showError('Please fill in all fields');
      return;
    }

    try {
      showLoader('Creating your account...');
      console.log('🚀 Step 1: Creating user account with:', {
        firstName,
        lastName,
        email,
        languagePreference: selectedLanguage, // Include language from step 0
      });

      // Create user account with language preference
      const response = await post('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        role: 'student',
        languagePreference: selectedLanguage, // Send language from step 0
      });

      console.log('✅ Step 1: User account created:', response);

      hideLoader();

      if (response) {
        // Save token and user ID IMMEDIATELY
        let token = response.accessToken;
        if (response.data?.accessToken) {
          token = response.data.accessToken;
        }
        
        let user = response.user;
        if (response.data?.user) {
          user = response.data.user;
        }

        if (token) {
          setAuthToken(token);
          localStorage.setItem('auth_token', token);
          console.log('✅ Token saved:', token.substring(0, 20) + '...');
        }
        
        if (user?.id) {
          setUserId(user.id);
          localStorage.setItem('user_data', JSON.stringify(user));
          console.log('✅ User ID saved:', user.id);
        }

        showSuccess('Account created! Let\'s continue setup...');
        
        // Move to avatar step
        setTimeout(() => {
          setShowAvatar(true);
        }, 1000);
      }
    } catch (error: any) {
      hideLoader();
      console.error('❌ Step 1: Signup error:', error);
      
      const errorMessage = error?.response?.message || error?.message || 'Failed to create account. Please try again.';
      showError(errorMessage);
    }
  };

  // Step 3: Update avatar
  const handleAvatarContinue = async () => {
    try {
      showLoader('Saving avatar...');
      console.log('🚀 Step 3: Updating avatar:', { 
        userId, 
        avatarUrl,
        token: authToken ? 'Token available' : 'NO TOKEN!'
      });

      // Ensure token is in localStorage
      const currentToken = authToken || localStorage.getItem('auth_token');
      if (!currentToken) {
        showError('Session expired. Please try again.');
        return;
      }

      const response = await post('/users/profile', {
        avatarUrl,
      });

      console.log('✅ Step 3: Avatar updated:', response);

      hideLoader();
      showSuccess('Avatar saved!');
      
      // Move to mascot creation step
      setTimeout(() => {
        setShowMascotCreation(true);
      }, 800);
    } catch (error: any) {
      hideLoader();
      console.error('❌ Step 3: Avatar update error:', error);
      
      const errorMessage = error?.response?.message || error?.message || 'Failed to save avatar';
      showError(errorMessage);
    }
  };

  // Step 4: Update mascot and complete signup
  const handleMascotSave = async (parts: { face: string; hair: string; body: string }) => {
    try {
      showLoader('Saving your mascot...');
      console.log('🚀 Step 4: Updating mascot:', {
        userId,
        mascotParts: parts,
      });

      // Update mascot
      const response = await post('/users/profile', {
        mascot: parts,
      });

      console.log('✅ Step 4: Mascot saved:', response);

      hideLoader();
      showSuccess('Setup complete! Welcome aboard! 🎉');
      
      // Redirect to student dashboard
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    } catch (error: any) {
      hideLoader();
      console.error('❌ Step 4: Mascot update error:', error);
      
      const errorMessage = error?.response?.message || error?.message || 'Failed to save mascot';
      showError(errorMessage);
    }
  };

  const handleMascotBack = () => {
    // Go back to avatar selection
    setShowMascotCreation(false);
  };

  const handleSelectAvatar = () => {
    setShowAvatarDialog(true);
  };

  const handleAvatarSelected = (url: string) => {
    setAvatarUrl(url);
    setShowAvatarDialog(false);
  };

  return (
    <RolePageLayout role="student" page="signup">
      {showMascotCreation ? (
        /* Mascot creation step */
        <div
          className="fixed inset-0 flex min-h-screen w-full flex-col font-sans p-[44px]"
          style={{ background: "rgba(0, 0, 32, 0.80)" }}
        >
          <div className="relative z-10 mb-[54px] flex justify-center">
            <EduPortal text="EduPortal" />
          </div>
          <MascotCreation
            initialParts={mascotParts}
            onPartSelect={setMascotParts}
            onSave={handleMascotSave}
            onBack={handleMascotBack}
          />
        </div>
      ) : (
        <div
          className="fixed inset-0 flex min-h-screen w-full flex-col items-center justify-center font-sans"
          style={{ background: "rgba(0, 0, 32, 0.80)" }}
        >
          <div className="relative z-10 mb-[59px] flex justify-center">
            <EduPortal text="EduPortal" />
          </div>

        {!languageSelected ? (
          /* Language selection step */
          <main
            className="relative z-20 flex flex-col items-center gap-[44px] rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white"
            style={{
              display: "flex",
              width: "510px",
              minHeight: "350px",
              padding: "44px",
              flexDirection: "column",
              alignItems: "center",
              gap: "44px",
              borderRadius: "51.22px",
              border: "2px solid #E451FE",
              background: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
              boxSizing: "border-box",
            }}
          >
            {/* Content area: 418 x 258 */}
            <div
              className="flex w-full flex-col items-center gap-[44px]"
              style={{
                width: "418px",
                minHeight: "258px",
              }}
            >
              <h1
                className="text-center"
                style={{
                  color: "#FFFFFF",
                  fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "42px",
                  letterSpacing: "-0.396px",
                  textTransform: "uppercase",
                }}
              >
                Choose language
              </h1>

              <div className="w-full">
                <SelectField
                  placeholder="Select language"
                  options={[
                    { label: "English", value: "en", iconName: "english" },
                    { label: "Arabic", value: "ar", iconName: "arabic" },
                    { label: "French", value: "fr", iconName: "france" },
                    { label: "Hindi", value: "hi", iconName: "india" },
                    { label: "Spanish", value: "es", iconName: "spanish" },
                  ]}
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  className="block! w-full!"
                />
              </div>

              <div className="w-full">
                <PrimaryButton
                  type="button"
                  text="Continue"
                  className="w-full"
                  onClick={handleLanguageContinue}
                />
              </div>
            </div>
          </main>
        ) : !showAvatar ? (
          /* Signup form step */
          <main
            className="relative z-20 flex w-full max-w-[501px] flex-col rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
            style={{
              background:
                "linear-gradient(154.52deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
            }}
          >
            <h1
              className="mb-[32px] text-center"
              style={{
                color: "#FFFFFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "42px",
                letterSpacing: "-0.396px",
                textTransform: "uppercase",
              }}
            >
              Sign up
            </h1>

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-6">
              <InputField
                label="First Name"
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-6">
              <InputField
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <InputField
                label="Email or school ID"
                type="email"
                placeholder="Enter email or school ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-11">
              <InputField
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endIconSrc="/assets/icons/others/eye.svg"
                endIconAlt="Toggle password visibility"
                endIconWidth={20}
                endIconHeight={20}
                required
              />
            </div>

            {/* Continue button */}
            <div className="mt-11">
              <PrimaryButton type="submit" text="Continue" />
            </div>
          </form>

            {/* Sign in link with 24px margin-top */}
            <Link
              href="/student/login"
              className="mt-[24px] self-stretch text-center"
              style={{
                color: "#FFF",
                fontFamily: "var(--font-orbitron), system-ui, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "150%",
                letterSpacing: "-0.198px",
                textTransform: "uppercase",
              }}
            >
              Sign in
            </Link>
          </main>
        ) : (
          /* Avatar selection step */
          <main
            className="relative z-20 flex flex-col items-center gap-[44px] rounded-[51.22px] border-2 border-[#E451FE] p-[44px] text-white"
            style={{
              display: "flex",
              width: "505px",
              minHeight: "350px",
              padding: "44px",
              flexDirection: "column",
              alignItems: "center",
              gap: "44px",
              borderRadius: "51.22px",
              border: "2px solid #E451FE",
              background: "linear-gradient(155deg, #0B0F37 12.01%, #1B1F4E 94.63%)",
              boxSizing: "border-box",
            }}
          >
            {/* Content area: 413 x 258 */}
            <div
              className="flex w-full flex-col items-center gap-[44px]"
              style={{
                width: "413px",
                minHeight: "258px",
              }}
            >
              <AddAvatar
                avatarUrl={avatarUrl}
                onSelectAvatar={handleSelectAvatar}
                onContinue={handleAvatarContinue}
              />
            </div>
          </main>
        )}

          {/* Avatar selection dialog */}
          <SelectAvatarDialog
            open={showAvatarDialog}
            selectedAvatarUrl={avatarUrl}
            onSelect={handleAvatarSelected}
            onClose={() => setShowAvatarDialog(false)}
          />
        </div>
      )}
    </RolePageLayout>
  );
}

