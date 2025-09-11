"use server";

import { cookies } from "next/headers";
import { API_URL } from "../constants";
import { LoginForm, loginFormSchema } from "../formSchemas";
import { actionClient } from "./safe-action";
import { sendMail } from "../mail";
import z from "zod";

const enquireNowFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  contactNumber: z.string().min(1, {
    message: "Contact Number is required",
  }),
  email: z.string().email({
    message: "Invalid Email Address",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  message: z.string().min(1, {
    message: "Message is required",
  }),
  productCodes: z.string().min(1, {
    message: "Product Code is required",
  }),
  // categoryName: z.string().min(1, {
  //   message: "Category Name is required"
  // })
});

export const submitEnquiryForm = actionClient
  .schema(enquireNowFormSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const res = await fetch(`${API_URL}products/enquiry-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      return {
        success: true,
        message: "Enquiry submitted successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  });

export const loginForm = async (values: LoginForm) => {
  try {
    const res = await fetch(`${API_URL}users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    const userId = data.id;
    const token = data.token;
    const rolePermissions = data.rolePermissions;

    const oneDay = 24 * 60 * 60;

    (await cookies()).set("token", token, {
      maxAge: oneDay,
    });
    (await cookies()).set("userId", userId, {
      maxAge: oneDay,
    });
    (await cookies()).set("rolePermissions", JSON.stringify(rolePermissions), {
      maxAge: oneDay,
    });
    (await cookies()).set("userType", "ADMIN", {
      maxAge: oneDay,
    });

    return {
      success: true,
      message: "Login successful",
      ...data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

// export const loginForm = actionClient
//   .schema(loginFormSchema)
//   .action(async ({ parsedInput: values }) => {
//     try {
//       const res = await fetch(`${API_URL}users/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });
//
//       const data = await res.json();
//
//       const userId = data.id;
//       const token = data.token;
//       const rolePermissions = data.rolePermissions;
//
//       const oneDay = 24 * 60 * 60;
//
//       cookies().set("token", token, {
//         maxAge: oneDay,
//       });
//       cookies().set("userId", userId, {
//         maxAge: oneDay,
//       });
//       cookies().set("rolePermissions", JSON.stringify(rolePermissions), {
//         maxAge: oneDay,
//       });
//       cookies().set("userType", "ADMIN", {
//         maxAge: oneDay,
//       });
//
//       return {
//         success: true,
//         message: "Login successful",
//         ...data,
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         success: false,
//         message: "Something went wrong",
//       };
//     }
//   });

export const retailerLoginForm = async (values: LoginForm) => {
  try {
    const res = await fetch(`${API_URL}retailers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    // console.log(data);
    // return;

    const retailerId = data.retailerId;
    const token = data.token;

    const oneDay = 24 * 60 * 60;

    (await cookies()).set("token", token, {
      maxAge: oneDay,
    });
    (await cookies()).set("retailerId", retailerId, {
      maxAge: oneDay,
    });
    (await cookies()).set("userType", "RETAILER", {
      maxAge: oneDay,
    });
    (await cookies()).set("countryId", data.countryId, {
      maxAge: oneDay,
    });
    (await cookies()).set("currencyId", data.currencyId, {
      maxAge: oneDay,
    });

    return {
      success: true,
      message: "Login successful",
      ...data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

// export const retailerLoginForm = actionClient
//   .schema(loginFormSchema)
//   .action(async ({ parsedInput: values }) => {
//     try {
//       const res = await fetch(`${API_URL}retailers/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });
//
//       const data = await res.json();
//       const retailerId = data.retailerId;
//       const token = data.token;
//
//       const oneDay = 24 * 60 * 60;
//
//       cookies().set("token", token, {
//         maxAge: oneDay,
//       });
//       cookies().set("retailerId", retailerId, {
//         maxAge: oneDay,
//       });
//       cookies().set("userType", "RETAILER", {
//         maxAge: oneDay,
//       });
//
//       return {
//         success: true,
//         message: "Login successful",
//         ...data,
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         success: false,
//         message: "Something went wrong",
//       };
//     }
//   });

export const logout = actionClient.action(async () => {
  try {
    (await cookies()).delete("token");
    (await cookies()).delete("userId");
    (await cookies()).delete("roleDetails");
    (await cookies()).delete("userType");
    (await cookies()).delete("retailerId");
    (await cookies()).delete("rolePermissions");
    (await cookies()).delete("countryId");
    (await cookies()).delete("currencyId");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
});
