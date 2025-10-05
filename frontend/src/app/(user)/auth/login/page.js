// src/app/login/page.js

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] bg-stone-200 flex items-center justify-center p-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="bg-gray-100 p-12 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Log In</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Log in to use your free Library card to borrow digital books
            from the nonprofit Internet Archive
          </p>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-12 md:w-1/2 flex flex-col justify-center">
          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              Log In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-700 mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 underline font-medium"
              >
                Sign up now
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
