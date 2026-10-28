import Link from "next/link";
import { EditorialAnimator } from "@/components/EditorialAnimator";
import { getContent } from "@/lib/content/load";
import { splitEvents, formatEventDate } from "@/lib/dates";
import { site } from "@/lib/site";

// Re-built at most hourly so "upcoming" stays correct (CONTRACT: REVALIDATE_SECONDS = 3600).
export const revalidate = 3600;

export default function HomePage() {
  const content = getContent();
  const latestIssue = content.digest[0];
  const { upcoming } = splitEvents(content.events, new Date());
  const featuredEvent = upcoming[0];
  const featuredProject = content.projects[0];

  return (
    <div className="editorial-home">
      {/* anime.js client-side animation coordinator */}
      <EditorialAnimator />

      {/* Structural Poster Hero */}
      <section className="poster-hero-section">
        {/* Main Hero Composition */}
        <div className="poster-hero-canvas">
          {/* Left Column: Hero Title, Tagline, Narrative & CTAs */}
          <div className="poster-left-col">
            <div className="poster-title-area">
              <h1 className="poster-massive-title font-serif">QQuest.</h1>
              <p className="poster-tagline font-serif italic">Because we like to ask why.</p>
              <p className="poster-statement">{site.description}</p>
              <div className="poster-cta-row">
                <a href="#showcase" className="editorial-cta-link">
                  EXPLORE WORK <span className="cta-line"></span>
                </a>
                <Link href="/join" className="editorial-ghost-link font-mono">
                  Join club →
                </Link>
                <Link href="/digest" className="editorial-ghost-link font-mono">
                  Weekly Digest →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Depth Section with Blue Rectangle Depth-Giver */}
          <div className="poster-right-col">
            <div className="depth-card-wrapper hero-depth-wrapper">
              <div className="depth-backdrop-rect hero-depth-rect" aria-hidden="true"></div>

              {/* Foreground Card */}
              <div className="editorial-card-frame hero-specs-card">
                {/* Corner Anchor Square */}
                <a href="#showcase" className="accent-corner-anchor" aria-label="Scroll to showcase">
                  <span>↓</span>
                </a>

                <div className="frame-header font-mono">
                  <span>MIT-ADT UNIVERSITY // PUNE</span>
                  <span>AUTUMN 2026</span>
                </div>

                <div className="hero-specs-body">
                  <h2 className="hero-specs-title font-serif">
                    Demystifying Quantum Physics Through Code.
                  </h2>
                  <p className="hero-specs-desc">
                    An open community of student researchers, engineers, and curious minds running experiments
                    on real IBM superconducting quantum processors.
                  </p>

                  <div className="hero-specs-grid font-mono">
                    <div className="spec-item">
                      <span className="spec-label">HARDWARE</span>
                      <span className="spec-value">IBM Quantum Heron &amp; Eagle</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">STACK</span>
                      <span className="spec-value">Qiskit 1.0 · Python · OpenQASM</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">MISSION</span>
                      <span className="spec-value">Peer-Reviewed &amp; 100% Open Access</span>
                    </div>
                  </div>
                </div>

                <div className="hero-specs-footer font-mono">
                  <a href="#event-feature" className="specs-action-link">
                    Explore Flagship Event Below ↓
                  </a>
                  <span className="specs-badge">FREE &amp; OPEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="editorial-divider" id="showcase"></div>

      {/* Alternating Editorial Showcase Stream */}
      <div className="editorial-showcase-stream">
        {/* 01. Flagship Event */}
        <section className="editorial-row row-left-text" id="event-feature">
          <div className="editorial-text-col">
            <div className="editorial-number font-serif">01.</div>
            <h2 className="editorial-item-title font-serif">
              {featuredEvent ? featuredEvent.title : "Qiskit Fall Fest 2026"}
            </h2>
            <p className="editorial-item-meta font-mono">
              {featuredEvent ? formatEventDate(featuredEvent.starts_at) : "3 & 4 NOVEMBER 2026"} ·{" "}
              {featuredEvent ? featuredEvent.mode.toUpperCase() : "HYBRID"}
            </p>
            <p className="editorial-item-desc">
              {featuredEvent
                ? featuredEvent.summary
                : "A two-day hybrid quantum computing event at MIT Art, Design and Technology University, Pune. Featuring keynote sessions from IBM, hands-on Qiskit circuits on real quantum hardware, and a closing challenge."}
            </p>
            <div className="editorial-action-area">
              {featuredEvent?.registration_url ? (
                <a
                  href={featuredEvent.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-action-link"
                >
                  REGISTER ON EVENT PORTAL <span className="link-arrow-rule"></span>
                </a>
              ) : (
                <Link href={`/events/${featuredEvent?.slug || "qff-2026"}`} className="editorial-action-link">
                  VIEW EVENT DETAILS <span className="link-arrow-rule"></span>
                </Link>
              )}
            </div>
          </div>

          <div className="editorial-media-col">
            <div className="depth-card-wrapper">
              <div className="depth-backdrop-rect" aria-hidden="true"></div>
              <div className="editorial-card-frame">
                <div className="structural-block-corner" aria-hidden="true"></div>
                <div className="frame-header font-mono">
                  <span>EVENT / MIT-ADT PUNE</span>
                  <span>FLAGSHIP</span>
                </div>
                <div className="frame-body">
                  <h3 className="frame-title font-serif">Qiskit Fall Fest 2026</h3>
                  <p className="frame-location font-mono">
                    {featuredEvent ? featuredEvent.location : "MIT-ADT University, Pune & Online"}
                  </p>
                  <div className="frame-points font-mono">
                    <div>— Session 1: Quantum 101 Foundations</div>
                    <div>— Session 2: Hands-on Qiskit 1.0 Lab</div>
                    <div>— Session 3: Closing Optimization Challenge</div>
                  </div>
                </div>
                <div className="frame-footer font-mono">
                  <a
                    href="https://qff-2026-site.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="frame-external-link"
                  >
                    Visit Event Microsite ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02. Weekly Digest */}
        <section className="editorial-row row-right-text" id="digest-feature">
          <div className="editorial-media-col">
            <div className="depth-card-wrapper">
              <div className="depth-backdrop-rect rect-left" aria-hidden="true"></div>
              <div className="editorial-card-frame">
                <div className="structural-block-corner" aria-hidden="true"></div>
                <div className="frame-header font-mono">
                  <span>DIGEST / ISSUE {latestIssue ? latestIssue.issue : "1"}</span>
                  <span>{latestIssue ? latestIssue.date : "OCT 2026"}</span>
                </div>
                <div className="frame-body">
                  <h3 className="frame-title font-serif">
                    {latestIssue ? latestIssue.title : "Sample issue: how this digest works"}
                  </h3>
                  <p className="frame-location font-mono">Curated by QQuest Editorial Team</p>
                  <p className="frame-excerpt">
                    {latestIssue
                      ? latestIssue.summary
                      : "A weekly, source-cited look at what happened in quantum computing. If a claim cannot be sourced from a paper, it gets cut."}
                  </p>
                  <div className="frame-tags font-mono">
                    {latestIssue?.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="frame-footer font-mono">
                  <span>Mandatory Source Citation (INV-3)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="editorial-text-col">
            <div className="editorial-number font-serif">02.</div>
            <h2 className="editorial-item-title font-serif">Cutting Qubit</h2>
            <p className="editorial-item-meta font-mono">WEEKLY NEWS · SOURCED &amp; FACT-CHECKED</p>
            <p className="editorial-item-desc">
              Like a hot cup of cutting chai, our weekly digest is short, strong, and grounded in reality.
              Every issue examines arXiv preprints, hardware announcements, and India&rsquo;s quantum
              landscape—with every single claim citing verified primary sources.
            </p>
            <div className="editorial-action-area">
              <Link
                href={`/digest/${latestIssue ? latestIssue.slug : "issue-001-welcome-to-the-digest"}`}
                className="editorial-action-link"
              >
                READ LATEST ISSUE <span className="link-arrow-rule"></span>
              </Link>
            </div>
          </div>
        </section>

        {/* 03. Projects */}
        <section className="editorial-row row-left-text" id="projects-feature">
          <div className="editorial-text-col">
            <div className="editorial-number font-serif">03.</div>
            <h2 className="editorial-item-title font-serif">
              {featuredProject ? featuredProject.title : "Bell State Explorer"}
            </h2>
            <p className="editorial-item-meta font-mono">
              {featuredProject ? `${featuredProject.year} · ${featuredProject.status.toUpperCase()}` : "2026 · ONGOING"}
            </p>
            <p className="editorial-item-desc">
              {featuredProject
                ? featuredProject.summary
                : "Open-source quantum tools, interactive simulators, and tutorial notebooks written by students for students. Built with Python and IBM Qiskit."}
            </p>
            <div className="editorial-action-area">
              {featuredProject?.repo_url ? (
                <a
                  href={featuredProject.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-action-link"
                >
                  VIEW REPOSITORY <span className="link-arrow-rule"></span>
                </a>
              ) : (
                <Link href="/projects" className="editorial-action-link">
                  EXPLORE PROJECTS <span className="link-arrow-rule"></span>
                </Link>
              )}
            </div>
          </div>

          <div className="editorial-media-col">
            <div className="depth-card-wrapper">
              <div className="depth-backdrop-rect" aria-hidden="true"></div>
              <div className="editorial-card-frame">
                <div className="structural-block-corner" aria-hidden="true"></div>
                <div className="frame-header font-mono">
                  <span>LABS / OPEN SOURCE</span>
                  <span>QISKIT 1.0</span>
                </div>
                <div className="frame-body">
                  <h3 className="frame-title font-serif">
                    {featuredProject ? featuredProject.title : "Bell State Explorer"}
                  </h3>
                  <p className="frame-location font-mono">Quantum Circuit Tomography</p>
                  <div className="frame-code-block font-mono">
                    <div>qc = QuantumCircuit(2)</div>
                    <div>qc.h(0)</div>
                    <div>qc.cx(0, 1) # Entangle</div>
                    <div className="code-comment"># |ψ⟩ = 1/√2 (|00⟩ + |11⟩)</div>
                  </div>
                </div>
                <div className="frame-footer font-mono">
                  <Link href="/projects" className="frame-external-link">
                    Browse All Projects →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04. Philosophy ("Why Kyu QQuest?") */}
        <section className="editorial-row row-right-text" id="philosophy-feature">
          <div className="editorial-media-col">
            <div className="depth-card-wrapper">
              <div className="depth-backdrop-rect rect-left" aria-hidden="true"></div>
              <div className="editorial-card-frame manifesto-frame">
                <div className="structural-block-corner" aria-hidden="true"></div>
                <div className="frame-header font-mono">
                  <span>IDENTITY / SPIRIT</span>
                  <span>DESI CURIOSITY</span>
                </div>
                <div className="frame-body">
                  <h3 className="manifesto-lead font-serif">&ldquo;Kyun?&rdquo; (क्यों)</h3>
                  <p className="manifesto-text font-serif">
                    Why settle for marketing headlines when you can test the algorithm? Curiosity is the first
                    quantum leap.
                  </p>
                  <div className="manifesto-pillars font-mono">
                    <div>01. Citations over claims</div>
                    <div>02. Transmon hardware over theory</div>
                    <div>03. Continuity across batches</div>
                  </div>
                </div>
                <div className="frame-footer font-mono">
                  <Link href="/about" className="frame-external-link">
                    Read Club Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="editorial-text-col">
            <div className="editorial-number font-serif">04.</div>
            <h2 className="editorial-item-title font-serif">Why &ldquo;Kyu QQuest&rdquo;?</h2>
            <p className="editorial-item-meta font-mono">THE CLUB PHILOSOPHY</p>
            <p className="editorial-item-desc">
              In Hindi, &ldquo;Kyun&rdquo; means <em>why</em>. Quantum computing is surrounded by massive headlines
              and venture buzz. We created QQuest to give students a direct, rigorous environment to write
              circuits, test error profiles on real hardware, and ask whether the physics actually holds up.
            </p>
            <div className="editorial-action-area">
              <Link href="/about" className="editorial-action-link">
                READ ABOUT THE CLUB <span className="link-arrow-rule"></span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <div className="editorial-divider"></div>

      {/* Editorial Closing / Join Section */}
      <section className="editorial-closing-section" id="join-section">
        <div className="depth-card-wrapper closing-depth-wrapper">
          <div className="depth-backdrop-rect" aria-hidden="true"></div>
          <div className="editorial-card-frame closing-card-frame">
            <p className="closing-kicker font-mono">GET IN TOUCH</p>
            <h2 className="closing-heading font-serif">
              Curious about quantum? <span className="poster-tagline italic">Come build with us.</span>
            </h2>
            <p className="closing-desc">
              QQuest is open to students across all years and engineering streams at MIT-ADT University. You do
              not need a background in theoretical physics—just curiosity and willingness to write code.
            </p>
            <div className="closing-actions">
              <Link href="/join" className="editorial-cta-link">
                APPLY TO JOIN THE CLUB <span className="cta-line"></span>
              </Link>
              <a href={`mailto:${site.contactEmail}`} className="closing-email-link font-mono">
                {site.contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
