import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      name: params.name as string,
      email: params.email as string,
    };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword, GitHub, Google],
});
