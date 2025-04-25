import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"

interface SanitizedData {
  bio: string | null
  website: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  updatedAt: Date
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = await params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).discordId !== id) {
      return NextResponse.json({ 
        error: "You can only update your own profile" 
      }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    const data = await request.json();

    const sanitizedData: {
      bio?: string;
      website?: string;
      github?: string;
      linkedin?: string;
      twitter?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date()
    };

    if (data.bio?.trim()) sanitizedData.bio = data.bio.trim();
    if (data.website?.trim()) sanitizedData.website = data.website.trim();
    if (data.github?.trim()) sanitizedData.github = data.github.trim();
    if (data.linkedin?.trim()) sanitizedData.linkedin = data.linkedin.trim();
    if (data.twitter?.trim()) sanitizedData.twitter = data.twitter.trim();

    const result = await db.collection("users").updateOne(
      { discordId: id },
      { 
        $set: sanitizedData 
      }
    );

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
    }

    const updatedUser = await db.collection("users").findOne(
      { discordId: id },
      {
        projection: {
          _id: 1,
          discordId: 1,
          name: 1,
          image: 1,
          bio: 1,
          website: 1,
          github: 1,
          linkedin: 1,
          twitter: 1,
          isAdmin: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    return NextResponse.json({ 
      message: "Profile updated successfully",
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      error: "Failed to update profile",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = await params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection("users").findOne(
      { discordId: id },
      {
        projection: {
          _id: 1,
          discordId: 1,
          name: 1,
          image: 1,
          bio: 1,
          website: 1,
          github: 1,
          linkedin: 1,
          twitter: 1,
          isAdmin: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ 
      error: "Failed to fetch profile",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 