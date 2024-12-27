import { useSession } from '@supabase/auth-helpers-react'
import AuthUI from '@/components/AuthUI'
import UserDashboard from '@/components/UserDashboard'
import Header from '@/components/Header'
import FeatureSection from '@/components/FeatureSection'

export default function Index() {
  const session = useSession()

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      
      {session ? (
        <UserDashboard />
      ) : (
        <div className="container mx-auto px-4">
          <div className="py-12 md:py-20">
            <FeatureSection />
            <div className="mt-12">
              <AuthUI />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}