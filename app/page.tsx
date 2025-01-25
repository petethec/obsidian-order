import { Button } from '@/components/ui/button';
import { ArrowRight, CircleDollarSign, Target, Vote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Drive Real Change Through
                <span className="text-primary"> Consequence-Based</span> Action
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Create and support campaigns that leverage financial incentives to
                hold individuals, corporations, and governments accountable.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/campaigns">
                  Explore Campaigns <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/create">Create Campaign</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <CircleDollarSign className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Financial Incentives</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Use crowdfunding to create meaningful consequences that drive action
                and accountability.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Target className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Clear Goals</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Set specific, measurable objectives with defined positive and
                negative consequences.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Vote className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Pledge to Vote</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Amplify your impact by pledging your vote alongside your financial
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Featured Campaigns
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Example Campaign Cards - These will be dynamic in the full implementation */}
            <div className="group relative rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?w=800&q=80"
                  alt="Clean Energy Initiative"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Clean Energy Initiative</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Support the transition to 100% renewable energy in our city by 2030.
              </p>
              <div className="mt-auto">
                <div className="bg-secondary h-2 rounded-full mb-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>$75,000 raised</span>
                  <span>$100,000 goal</span>
                </div>
              </div>
            </div>

            <div className="group relative rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80"
                  alt="Education Reform"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Education Reform</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Push for comprehensive education reform in underserved communities.
              </p>
              <div className="mt-auto">
                <div className="bg-secondary h-2 rounded-full mb-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '45%' }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>$45,000 raised</span>
                  <span>$100,000 goal</span>
                </div>
              </div>
            </div>

            <div className="group relative rounded-lg border p-6 hover:border-primary transition-colors">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80"
                  alt="Healthcare Access"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Healthcare Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Expand healthcare access to rural communities through mobile clinics.
              </p>
              <div className="mt-auto">
                <div className="bg-secondary h-2 rounded-full mb-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '60%' }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>$60,000 raised</span>
                  <span>$100,000 goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}