import { RolePageLayout } from "../../../../components/RolePageLayout";

export default function AdminSignupPage() {
  return (
    <RolePageLayout role="admin" page="signup">
      <div className="flex min-h-screen items-center justify-center font-sans">
        <main className="w-full max-w-md rounded-xl bg-white/85 p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-semibold text-gray-900">
            Admin Signup
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            This page uses the <code>admin/signup</code> background from the
            central config.
          </p>
          {/* TODO: replace with real admin signup form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Admin email"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Create admin account
            </button>
          </form>
        </main>
      </div>
    </RolePageLayout>
  );
}

