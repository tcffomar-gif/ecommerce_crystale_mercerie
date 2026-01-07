import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModal from "app/DBconfig/models/user";
import { connectMongoDB } from "app/DBconfig/mongodb";
import bcrypt from "bcrypt";


// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. "Sign in with...")
//       name: "Credentials",

//       credentials: {},
//       async authorize(credentials, req , res ) {
//         // Add logic here to look up the user from the credentials supplied

//         // 2- connect to DB
//         await connectMongoDB();
      

//         // @ts-ignore
//         const user = await UserModal.findOne({ email: credentials.email });

//         if (user) {
//             // الترتيب مهم جداً
//   // compare(credentials.password, user.password);
//           const match = await  bcrypt.compare(credentials.password, user.password);
                              
//           if (match && user.emailVerified) {
//             return user;
//           }else {return null;}
           
      
//         } else {
//           return null;
//         }
//       },





//     }),
//   ],

//   secret : process.env.NEXTAUTH_SECRET ,

//   callbacks: {
//     async session({session}) {
//       // @ts-ignore
//       const mongodbUser = await UserModal.findOne({ email: session.user.email })
//       session.user.id = mongodbUser._id.toString()

//       session.user = {...session.user, ...mongodbUser._doc}

//       return session
//     }
//   } ,

//   pages: {
//     signIn: '/login',
//   }

// };
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };





export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const user = await UserModal.findOne({ email: credentials.email });

          if (!user) return null;
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid || !user.emailVerified) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
            // Ajoutez d'autres champs nécessaires
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      try {
        if (token.sub) {
          const mongodbUser = await UserModal.findById(token.sub);
          if (mongodbUser) {
            session.user.id = mongodbUser._id.toString();
            session.user = { ...session.user, ...mongodbUser._doc };
          }
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt", // Utilisez JWT pour de meilleures performances
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };