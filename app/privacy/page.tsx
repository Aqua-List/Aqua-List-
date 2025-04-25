import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - AquaList",
  description: "Learn how AquaList collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: April 2, 2025</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          When you use AquaList, we collect the following types of information:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you sign in with Discord, we receive your Discord ID, username, email address (if authorized), and avatar.</li>
          <li><strong>Bot Information:</strong> When you submit a bot, we collect information about the bot, including its ID, name, description, and other details you provide.</li>
          <li><strong>Usage Data:</strong> We collect information about how you interact with our service, including pages visited, actions taken, and time spent on the site.</li>
          <li><strong>Device Information:</strong> We collect information about the device and browser you use to access AquaList.</li>
        </ul>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process bot submissions and reviews</li>
          <li>Communicate with you about your account and our services</li>
          <li>Monitor and analyze trends and usage</li>
          <li>Detect, prevent, and address technical issues and security breaches</li>
          <li>Comply with legal obligations</li>
        </ul>
        
        <h2>3. Information Sharing</h2>
        <p>
          We may share your information in the following circumstances:
        </p>
        <ul>
          <li><strong>Public Information:</strong> Information you provide about bots and public profile information is visible to all users of AquaList.</li>
          <li><strong>Service Providers:</strong> We may share information with third-party vendors who provide services on our behalf.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect the rights, property, or safety of AquaList, our users, or others.</li>
        </ul>
        
        <h2>4. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
        
        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul>
          <li>Accessing, correcting, or deleting your information</li>
          <li>Objecting to or restricting certain processing activities</li>
          <li>Data portability</li>
          <li>Withdrawing consent</li>
        </ul>
        <p>
          To exercise these rights, please contact us at <a href="mailto:privacy@aqualist.com">privacy@aqualist.com</a>.
        </p>
        
        <h2>6. Cookies and Similar Technologies</h2>
        <p>
          We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users. You can control cookies through your browser settings and other tools. For more information, please see our <a href="/cookies">Cookie Policy</a>.
        </p>
        
        <h2>7. Children's Privacy</h2>
        <p>
          AquaList is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>
        
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </p>
        
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@aqualist.com">privacy@aqualist.com</a>.
        </p>
      </div>
    </div>
  )
} 