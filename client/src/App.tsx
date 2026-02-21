import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const signup = async () => {
    const data = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
        rp: {
          name: "webauthn client",
          // id: "localhost", // This is optional
        },
        user: {
          id: new Uint8Array(16),
          // name is the unique identifier. Think of it like username, email or national code
          name: email,
          displayName: "shown name", // The name shown to the user
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          },
          // {
          //   type: "public-key",
          //   alg: -8,
          // },
          // {
          //   type: "public-key",
          //   alg: -257,
          // },
        ],
      },
    });
    console.log(data);
  };

  const login = () => {
    console.log("login", email);
  };

  return (
    <div className="container">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="email"
      />
      <button onClick={() => signup()}>Signup</button>
      <button onClick={() => login()}>Login</button>
    </div>
  );
}
export default App;
