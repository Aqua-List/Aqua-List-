import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility Statement - AquaList",
  description: "Learn about AquaList's commitment to accessibility and how we ensure our platform is usable by everyone.",
}

export default function AccessibilityPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p>
          AquaList is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
        </p>
        
        <h2>Conformance status</h2>
        <p>
          The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. AquaList is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
        </p>
        
        <h2>Feedback</h2>
        <p>
          We welcome your feedback on the accessibility of AquaList. Please let us know if you encounter accessibility barriers on AquaList:
        </p>
        <ul>
          <li>Email: <a href="mailto:accessibility@aqualist.com">accessibility@aqualist.com</a></li>
          <li>Discord: Join our <a href="https://discord.gg/BQrPPR8xWq">Discord server</a> and post in the #accessibility channel</li>
        </ul>
        <p>
          We try to respond to feedback within 2 business days.
        </p>
        
        <h2>Compatibility with browsers and assistive technology</h2>
        <p>
          AquaList is designed to be compatible with the following assistive technologies:
        </p>
        <ul>
          <li>Screen readers including NVDA, JAWS, VoiceOver, and TalkBack</li>
          <li>Screen magnification software</li>
          <li>Speech recognition software</li>
          <li>Keyboard-only navigation</li>
        </ul>
        
        <h2>Technical specifications</h2>
        <p>
          Accessibility of AquaList relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
        </p>
        <ul>
          <li>HTML</li>
          <li>WAI-ARIA</li>
          <li>CSS</li>
          <li>JavaScript</li>
        </ul>
        <p>
          These technologies are relied upon for conformance with the accessibility standards used.
        </p>
        
        <h2>Assessment approach</h2>
        <p>
          AquaList has assessed the accessibility of our platform by the following approaches:
        </p>
        <ul>
          <li>Self-evaluation</li>
          <li>User testing with assistive technologies</li>
          <li>Automated testing tools</li>
        </ul>
        
        <h2>Measures to support accessibility</h2>
        <p>
          AquaList takes the following measures to ensure accessibility:
        </p>
        <ul>
          <li>Include accessibility as a requirement for all new features and updates</li>
          <li>Provide continuous accessibility training for our staff</li>
          <li>Assign clear accessibility goals and responsibilities</li>
          <li>Employ formal accessibility quality assurance methods</li>
        </ul>
        
        <h2>Date</h2>
        <p>
          This statement was created on October 1, 2023.
        </p>
      </div>
    </div>
  )
} 