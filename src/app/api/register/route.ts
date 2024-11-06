import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await fetch("https://tasu.ziz.kz/api/v1/register/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      const errorData = await response.json();

      if (response.status === 400) {
        return NextResponse.json(
          { error: errorData || "Invalid input data" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: errorData || "Registration failed" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Registration request failed" },
      { status: 500 }
    );
  }
}
