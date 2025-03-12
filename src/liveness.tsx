import React from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';

export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{ sessionId: string } | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness = async () => {
      try {
        const response = await fetch('https://localhost:7065/api/FaceLiveness/create-session', {
          method: 'POST',
          headers: {
            'accept': '*/*'
          },
          body: '' // sending an empty body as in your curl command
        });
        if (!response.ok) {
          throw new Error(`Error fetching session ID: ${response.statusText}`);
        }
        const data = await response.json();
        setCreateLivenessApiData(data);
      } catch (error) {
        console.error('Error fetching session ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete = async () => {
    if (!createLivenessApiData) {
      console.error('No session ID available.');
      return;
    }

    try {
      const response = await fetch(`/api/get?sessionId=${createLivenessApiData.sessionId}`);
      const data = await response.json();

      /*
       * Note: The isLive flag should be determined in your backend based on the score returned by
       * the GetFaceLivenessSession API. Use this value to decide further actions in your app.
       */
      if (data.isLive) {
        console.log('User is live');
      } else {
        console.log('User is not live');
      }
    } catch (error) {
      console.error('Error fetching analysis result:', error);
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <FaceLivenessDetector
        sessionId={createLivenessApiData?.sessionId || ''}
        region="ap-south-1"
        onAnalysisComplete={handleAnalysisComplete}
        onError={(error) => {
          console.error(error);
        }}
      />
    </ThemeProvider>
  );
}
