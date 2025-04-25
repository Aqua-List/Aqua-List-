import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - AquaList",
  description: "Get in touch with the AquaList team for support, feedback, or inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="prose prose-lg dark:prose-invert">
            <p>
              We'd love to hear from you! Whether you have a question about our service, need help with your account, or want to provide feedback, we're here to assist.
            </p>
            
            <h2>Contact Information</h2>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:support@aqualist.com">support@aqualist.com</a></li>
              <li><strong>Discord:</strong> Join our <a href="https://discord.gg/BQrPPR8xWq" target="_blank" rel="noopener noreferrer">Discord server</a></li>
              <li><strong>Twitter:</strong> <a href="https://twitter.com/aqualist" target="_blank" rel="noopener noreferrer">@aqualist</a></li>
            </ul>
            
            <h2>Support Hours</h2>
            <p>
              Our team is available to assist you Monday through Friday, 9:00 AM to 5:00 PM UTC. We strive to respond to all inquiries within 24-48 hours.
            </p>
            
            <h2>Specific Inquiries</h2>
            <ul>
              <li><strong>Bot Submissions:</strong> <a href="mailto:bots@aqualist.com">bots@aqualist.com</a></li>
              <li><strong>Partnership Opportunities:</strong> <a href="mailto:partnerships@aqualist.com">partnerships@aqualist.com</a></li>
              <li><strong>Legal Matters:</strong> <a href="mailto:legal@aqualist.com">legal@aqualist.com</a></li>
              <li><strong>Privacy Concerns:</strong> <a href="mailto:privacy@aqualist.com">privacy@aqualist.com</a></li>
            </ul>
          </div>
        </div>
        
    
      </div>
    </div>
  )
} 