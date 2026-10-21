import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AiTrendsScenariosPage } from '@/pages/ai-trends-scenarios';
import { CareerMatchesPage } from '@/pages/career-matches';
import { HomePage } from '@/pages/home';
import { LearningRoadmapPage } from '@/pages/learning-roadmap';
import { SkillsProfilePage } from '@/pages/skills-profile';
import { SdgMappingPage } from '@/pages/sdg-mapping';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { loadProfile, saveProfile, type Profile } from '@/lib/profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  return (
    <RoutedErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/"><HomePage profile={profile}/></Route>
          <Route path="/skills"><SkillsProfilePage profile={profile} onSave={onSave}/></Route>
          <Route path="/careers"><CareerMatchesPage profile={profile} onSave={onSave}/></Route>
          <Route path="/roadmap"><LearningRoadmapPage profile={profile}/></Route>
          <Route path="/sdg-mapping"><SdgMappingPage profile={profile}/></Route>
          <Route path="/trends"><AiTrendsScenariosPage profile={profile}/></Route>
          <Route component={NotFound}/>
        </Switch>
      </AppShell>
    </RoutedErrorBoundary>
  );
}

function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const save = (nextProfile: Profile) => {
    setProfile(nextProfile);
    saveProfile(nextProfile);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router profile={profile} onSave={save}/>
        </WouterRouter>
        <Toaster/>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
