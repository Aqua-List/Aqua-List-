import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - AquaList",
  description: "Learn about how AquaList uses cookies and similar technologies.",
}

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: April 2, 2025</p>
        
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
        </p>
        
        <h2>2. How We Use Cookies</h2>
        <p>
          AquaList uses cookies for the following purposes:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</li>
          <li><strong>Preference Cookies:</strong> These cookies allow us to remember choices you make and provide enhanced, personalized features. They may be set by us or by third-party providers whose services we have added to our pages.</li>
          <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve the way our website works.</li>
          <li><strong>Authentication Cookies:</strong> These cookies help us identify users and maintain their logged-in status.</li>
        </ul>
        
        <h2>3. Third-Party Cookies</h2>
        <p>
          Some cookies are placed by third parties on our website. These third parties may include:
        </p>
        <ul>
          <li>Analytics providers (such as Google Analytics)</li>
          <li>Authentication services (such as Discord)</li>
        </ul>
        <p>
          These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website and other websites.
        </p>
        
        <h2>4. Managing Cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>Delete all cookies from your browser</li>
          <li>Block all cookies by activating the setting on your browser that allows you to refuse all cookies</li>
          <li>Block or allow specific types of cookies</li>
        </ul>
        <p>
          Please note that if you choose to block all cookies, you may not be able to access all or parts of our site or some features may not function properly.
        </p>
        
        <h2>5. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </p>
        
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Cookie Policy, please contact us at <a href="mailto:privacy@aqualist.com">privacy@aqualist.com</a>.
        </p>
      </div>
    </div>
  )
} 