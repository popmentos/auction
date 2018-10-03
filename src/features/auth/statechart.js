export const stateMachine =  {
    initial: 'form',
    states: {
      form: {
        on: {
          CLOSE: 'exit',
          SUBMIT: [
            {
              target: 'loading',
              cond: ({ state }) =>
                Object.values(state).filter(val => val === '' || val === false || val === 'PLEASE SIGN IN TO METAMASK'
                || val === 'Loading...' ).length === 0
            },
            { target: 'error' }
          ]
        }
      },
      exit: {
        onEntry: 'handleRedirect'
      },
      loading: {
        onEntry: 'handleAuthentication',
        on: {
          SUCCESS: 'authenticated',
          FAIL: 'error'
        }
      },
      authenticated: {
        onEntry: 'handleAuthentication'
      },
      error: {
        onEntry: 'handleShowError',
        on: {
          CLOSE: 'exit',
          SUBMIT: [
            {
              target: 'loading',
              cond: ({ state }) =>
                Object.values(state).filter(val => val === '' || val === false || val === 'PLEASE SIGN IN TO METAMASK'
                || val === 'Loading...' ).length === 0
            },
            { target: 'error' }
          ]
        }
      }
    }
  };