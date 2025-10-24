import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh1uH-scxheyfriTEBi5i9SwY76fb5vhRf5rkfypVKUWuYy8BlBEI8p6Gj6v4iOt4vrmbkD1vAE5pC9ZJjbyT0upLwfLeVj0myQFgxp_W2T2_a-LuOg5XdQ0wYHro6A4Se1Rgqaf_TpnBnwNOTl4hMs9HlDHhZ2nBJFdpLmKDEx9gqB6vCR0elKQv_srHUtNn-Q1oW9mSn-zqrfjNOY5nvl0hL2aWnpHRS6-P_Z3WGfBQRVcGP0MdvEmIx0V6NjWxdJMQFbVskfKx5l37Q6vT884jKv4g&lib=MuYsjupAABHnb8YXhYhaAABxIoJWoTElh"
    );

    const data = await res.json();

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Sunucu hatası oluştu." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /getPublicHoliday error:", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
