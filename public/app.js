(function(){
  const e = React.createElement;
  const { BrowserRouter, Switch, Route, Link, useHistory, useLocation } = ReactRouterDOM;

  function now(){ return new Date().toISOString(); }
  function log(){ try{ const a = Array.prototype.slice.call(arguments); if(a.length===1) console.log(now(), a[0]); else console.log(now(), a); }catch(e){} }

  function RouteLogger(){
    const location = useLocation();
    React.useEffect(function(){ log('route.change', location && location.pathname); }, [location && location.pathname]);
    return null;
  }

  function Nav(){
    return e('header', {className:'nav'},
      e('div', {className:'brand'}, 'Jaigopal'),
      e('nav', null,
        e(Link, {to:'/', onClick:function(){ log('link.click','/'); }}, 'Home'),
        e(Link, {to:'/dashboard', onClick:function(){ log('link.click','/dashboard'); }}, 'Dashboard'),
        e(Link, {to:'/login', onClick:function(){ log('link.click','/login'); }}, 'Login'),
        e(Link, {to:'/signup', onClick:function(){ log('link.click','/signup'); }}, 'Signup')
      )
    );
  }

  function Home(){
    React.useEffect(function(){ log('view.enter','Home'); }, []);
    return e('main', {className:'container'},
      e('section', {className:'hero'},
        e('div', null,
          e('h1', {className:'title'}, 'Home'),
          e('p', {className:'subtitle'}, 'Welcome to the main landing page. Use the options below to access your account or create a new one.'),
          e('div', {className:'actions'},
            e(Link, {to:'/login', className:'btn'}, 'Go to Login'),
            e(Link, {to:'/signup', className:'btn secondary'}, 'Create an Account')
          )
        ),
        e('div', {className:'panel'},
          e('h3', null, 'Getting started'),
          e('p', null, 'Use the navigation bar to explore the four primary routes required by the assignment.'),
          e('p', {className:'subtitle'}, 'After a successful login or signup, a confirmation message appears on the dashboard.')
        )
      )
    );
  }

  function Dashboard(){
    const location = useLocation();
    const message = location && location.state && location.state.flash;
    const images = [
      {
        src: '/images/venice-beach-skateboarding.jpg',
        title: 'Venice Beach session',
        text: 'Late afternoon street session by the boardwalk.'
      },
      {
        src: '/images/bowl-skateboarding.jpg',
        title: 'Bowl skateboarding',
        text: 'Carving lines through a smooth concrete bowl.'
      },
      {
        src: '/images/best-trick-contest.jpg',
        title: 'Best trick contest',
        text: 'Skaters waiting their turn during a contest run.'
      }
    ];
    React.useEffect(function(){ log('view.enter','Dashboard'); }, []);
    return e('main', {className:'container'},
      e('section', {className:'panel'},
        e('h1', {className:'title'}, 'Dashboard'),
        e('p', {className:'subtitle'}, 'Overview of activity and quick actions.'),
        message ? e('div', {className:'alert'}, message) : null,
        e('div', {className:'grid'},
          e('div', {className:'stat'}, e('h3', null, 'Active sessions'), e('p', null, '12 live sessions tracked.')),
          e('div', {className:'stat'}, e('h3', null, 'New signups'), e('p', null, '8 people signed up today.')),
          e('div', {className:'stat'}, e('h3', null, 'Logins'), e('p', null, '34 logins this week.')),
          e('div', {className:'stat'}, e('h3', null, 'System status'), e('p', null, 'All systems operational.'))
        )
      ),
      e('section', {className:'panel'},
        e('h2', {className:'title'}, 'Skate Gallery'),
        e('p', {className:'subtitle'}, 'Selected images from recent skate sessions.'),
        e('div', {className:'gallery'},
          images.map(function(item){
            return e('div', {className:'card', key:item.src},
              e('img', {className:'thumb', src:item.src, alt:item.title}),
              e('div', {className:'card-body'},
                e('h3', {className:'card-title'}, item.title),
                e('p', {className:'card-text'}, item.text)
              )
            );
          })
        )
      )
    );
  }

  function Login(){
    const history = useHistory();
    const stateEmail = React.useState('');
    const statePassword = React.useState('');
    const email = stateEmail[0];
    const setEmail = stateEmail[1];
    const password = statePassword[0];
    const setPassword = statePassword[1];
    React.useEffect(function(){ log('view.enter','Login'); }, []);
    function onSubmit(ev){ ev.preventDefault(); log('auth.login.attempt', { email: email }); history.push('/dashboard', { flash: 'Login successful. Welcome back.' }); }
    return e('main', {className:'container'},
      e('section', {className:'panel'},
        e('h1', {className:'title'}, 'Login'),
        e('p', {className:'subtitle'}, 'Sign in to continue to the dashboard.'),
        e('form', {onSubmit:onSubmit},
          e('div', null, e('label', null, 'Email'), e('input', {type:'email', value:email, onChange:function(ev){ setEmail(ev.target.value); log('input.change','login.email'); }})),
          e('div', null, e('label', null, 'Password'), e('input', {type:'password', value:password, onChange:function(ev){ setPassword(ev.target.value); log('input.change','login.password'); }})),
          e('div', null, e('button', {type:'submit', className:'btn'}, 'Login'))
        )
      )
    );
  }

  function Signup(){
    const history = useHistory();
    const stateEmail = React.useState('');
    const statePassword = React.useState('');
    const email = stateEmail[0];
    const setEmail = stateEmail[1];
    const password = statePassword[0];
    const setPassword = statePassword[1];
    React.useEffect(function(){ log('view.enter','Signup'); }, []);
    function onSubmit(ev){ ev.preventDefault(); log('auth.signup.attempt', { email: email }); history.push('/dashboard', { flash: 'Signup successful. Your account is ready.' }); }
    return e('main', {className:'container'},
      e('section', {className:'panel'},
        e('h1', {className:'title'}, 'Signup'),
        e('p', {className:'subtitle'}, 'Create an account in a few seconds.'),
        e('form', {onSubmit:onSubmit},
          e('div', null, e('label', null, 'Email'), e('input', {type:'email', value:email, onChange:function(ev){ setEmail(ev.target.value); log('input.change','signup.email'); }})),
          e('div', null, e('label', null, 'Password'), e('input', {type:'password', value:password, onChange:function(ev){ setPassword(ev.target.value); log('input.change','signup.password'); }})),
          e('div', null, e('button', {type:'submit', className:'btn'}, 'Signup'))
        )
      )
    );
  }

  function Layout(props){
    return e('div', {className:'page'},
      e(Nav),
      props.children,
      e('footer', {className:'footer'}, 'Clear navigation and consistent layout across all pages.')
    );
  }

  function App(){
    return e(BrowserRouter, null,
      e(Layout, null,
        e(RouteLogger),
        e(Switch, null,
          e(Route, {exact:true, path:'/', component: Home}),
          e(Route, {path:'/dashboard', component: Dashboard}),
          e(Route, {path:'/login', component: Login}),
          e(Route, {path:'/signup', component: Signup}),
          e(Route, {component: Home})
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
