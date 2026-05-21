import React, { useEffect } from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { ChatProvider } from './context/ChatContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import TabContent from './components/layout/TabContent';
import AIChatAssistant from './features/chat/AIChatAssistant';
import { track } from './utils/eventTracking';
import { EVENT_TYPES } from './constants/trackingConfig';

function App() {
  useEffect(() => {
    track(EVENT_TYPES.CHAT_EVENT, {
      eventType: 'startup',
      message: 'Canon CIO Command Center initialized',
    });
  }, []);

  return (
    <DashboardProvider>
      <ChatProvider>
        <DashboardLayout>
          <Header />
          <div className="pt-16 flex flex-col flex-1">
            <TabNavigation />
            <main className="flex-1 max-w-[1440px] mx-auto w-full">
              <TabContent />
            </main>
          </div>
          <AIChatAssistant />
        </DashboardLayout>
      </ChatProvider>
    </DashboardProvider>
  );
}

export default App;