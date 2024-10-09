import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-8 bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto my-16 text-center">
        <h1 className="mb-6 text-5xl font-bold text-blue-800">The Future of Estimation Software for Contractors</h1>
        <p className="mb-8 text-xl text-gray-600">Create accurate, detailed estimates with ease—tailored for plumbing and adaptable to any trade.</p>
        <button className="px-6 py-3 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
          Get Started Now
        </button>
        <div className="relative mt-12">
          <Image
            src="/hero-image.jpg"
            alt="Estimator reviewing a digital project"
            width={800}
            height={400}
            className="rounded-lg shadow-xl"
          />
          <div className="absolute top-0 left-0 px-4 py-2 text-white bg-blue-600 rounded-tl-lg rounded-br-lg">
            Water System
          </div>
          <div className="absolute bottom-0 right-0 px-4 py-2 text-white bg-green-600 rounded-tr-lg rounded-bl-lg">
            Unit A
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-5xl mx-auto my-16">
        <h2 className="mb-12 text-4xl font-bold text-center text-blue-800">Key Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-blue-700">Custom Line Items with Tags</h3>
            <p className="text-gray-600">Add custom line items for materials and labor, categorized by system and project area using our flexible tagging system.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-blue-700">Predefined Data and CSV Import</h3>
            <p className="text-gray-600">Easily add or remove predefined items and quickly upload multiple line items with our CSV import feature.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-blue-700">Flexible Estimation</h3>
            <p className="text-gray-600">Generate separate totals for different units or systems, perfect for detailed breakdowns required by general contractors.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-blue-700">Advanced Features</h3>
            <p className="text-gray-600">Enjoy bulk editing, tag suggestions, cost history tracking, and custom reports for enhanced usability and analysis.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto my-16">
        <h2 className="mb-12 text-4xl font-bold text-center text-blue-800">How It Works</h2>
        <div className="space-y-8">
          {['Add custom line items', 'Assign tags', 'View real-time cost summary', 'Export final estimate'].map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 mr-6 text-2xl font-bold text-white bg-blue-600 rounded-full">
                {index + 1}
              </div>
              <p className="text-xl text-gray-700">{step}</p>
            </div>
          ))}
        </div>
        <button className="block px-6 py-3 mx-auto mt-12 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
          See it in Action
        </button>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-5xl mx-auto my-16">
        <h2 className="mb-12 text-4xl font-bold text-center text-blue-800">What Our Customers Say</h2>
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <p className="mb-6 text-xl text-gray-600">
          &quot;Our plumbing estimates are now 98% more accurate, with clear breakdowns by system and unit. It&apos;s saved us time and improved our bid success rate!&quot;
          </p>
          <p className="font-semibold text-blue-700">- John Doe, Master Plumber</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-4xl mx-auto my-16 text-center">
        <h2 className="mb-12 text-4xl font-bold text-blue-800">Plans and Pricing</h2>
        <p className="mb-8 text-xl text-gray-600">Choose the plan that fits your business needs</p>
        <button className="px-6 py-3 text-lg font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
          Start Your Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="w-full p-8 mt-16 text-center bg-white border-t border-gray-200">
        <p className="mb-4 text-gray-600">Simplifying the estimation process for contractors with user-friendly, accurate software.</p>
        <div className="flex justify-center mb-6 space-x-6">
          {['Features', 'Pricing', 'Support', 'About Us'].map((item, index) => (
            <a key={index} href="#" className="text-blue-600 transition duration-300 hover:text-blue-800">
              {item}
            </a>
          ))}
        </div>
        <div className="flex justify-center space-x-6">
          {['facebook', 'twitter', 'linkedin', 'instagram'].map((social, index) => (
            <a key={index} href="#" className="text-gray-400 transition duration-300 hover:text-blue-600">
              <span className="sr-only">{social}</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
