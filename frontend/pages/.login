import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from '@/lib/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      const { access_token } = res.data;
      localStorage.setItem('token', access_token);
      alert('Logged in successfully');
      router.push('/profile');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
      <p>Don’t have an account? <Link href="/register">Register here</Link></p>
    </div>
  );
}