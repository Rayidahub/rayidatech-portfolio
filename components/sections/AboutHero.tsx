import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutHero() {
  return (
    <section>
      <div aria-hidden="true">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/about-portrait.png"
            alt="Raymond Gaius"
          />
        </div>
      </div>

      <div>
        <div>
          <div>
            <p>
              Strategic, bold, and built to connect.
            </p>
            <h1>
              Product
              <br />
              Designer
              <br />
              <span>& AI Engineer</span>
            </h1>
          </div>

          <div>
            <p>
              Raymond Gaius builds digital experiences that merge clean design
              with intelligent systems. Based in Nigeria, working globally.
            </p>

            <Link href="/contact">
              <span>
                Start a Project
              </span>
              <span>
                <ArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
