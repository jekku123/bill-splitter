import LoginForm from './form';

export default function LoginPage() {
  return (
    <main className="flex flex-col p-24">
      <LoginForm />
      {/* <form action={githubLogin}>
        <FormButton>Login with Github</FormButton>
      </form> */}
    </main>
  );
}
