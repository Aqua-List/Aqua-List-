import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - AquaList",
  description: "Read the terms of service for using AquaList, the Discord bot directory.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: April 2, 2025</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using AquaList, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
        </p>
        
        <h2>2. Description of Service</h2>
        <p>
          AquaList is a directory service that allows users to discover, list, and review Discord bots. We provide a platform for bot developers to showcase their bots and for users to find bots that suit their needs.
        </p>
        
        <h2>3. User Accounts</h2>
        <p>
          To submit a bot or access certain features, you may need to create an account using your Discord credentials. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        
        <h2>4. Bot Submissions</h2>
        <p>
          When submitting a bot to AquaList, you represent that:
        </p>
        <ul>
          <li>You own or have the necessary rights to the bot</li>
          <li>The bot does not violate Discord's Terms of Service</li>
          <li>The bot does not contain malicious code or functionality</li>
          <li>The information provided about the bot is accurate and not misleading</li>
        </ul>
        
        <h2>5. Content Guidelines</h2>
        <p>
          Users may not post content that:
        </p>
        <ul>
          <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of privacy</li>
          <li>Infringes on intellectual property rights</li>
          <li>Contains software viruses or any other code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
          <li>Constitutes unauthorized advertising, spam, or any form of deceptive marketing</li>
        </ul>
        
        <h2>6. Moderation and Removal</h2>
        <p>
          AquaList reserves the right to moderate, edit, or remove any content that violates these terms or that we find objectionable for any reason. We may also suspend or terminate user accounts for violations.
        </p>
        
        <h2>7. Intellectual Property</h2>
        <p>
          The AquaList service, including its design, logos, and content created by our team, is protected by copyright, trademark, and other intellectual property laws. Users retain ownership of their own content but grant AquaList a license to display and distribute that content on our platform.
        </p>
        
        <h2>8. Limitation of Liability</h2>
        <p>
          AquaList is provided "as is" without warranties of any kind. We are not responsible for the actions, content, information, or data of third parties, including bots listed on our platform. In no event shall AquaList be liable for any damages arising out of or in connection with the use of our service.
        </p>
        
        <h2>9. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Continued use of AquaList after changes constitutes acceptance of the modified terms.
        </p>
        
        <h2>10. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which AquaList operates, without regard to its conflict of law provisions.
        </p>
        
        <h2>11. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:legal@aqualist.com">legal@aqualist.com</a>.
        </p>
      </div>
    </div>
  )
} 