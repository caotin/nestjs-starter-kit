import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { FACEBOOK_ID, FACEBOOK_SECRET } from "@environments";
import { CreateFacebookAccount } from "../dto/auth.dto";

@Injectable()
export class FackebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: FACEBOOK_ID,
            clientSecret: FACEBOOK_SECRET,
            callbackURL: `http://localhost:${process.env.APP_PORT}/api/auth/${process.env.FB_CALLBACK_URL}`,
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
        const { emails, id, name } = profile;
        const user: CreateFacebookAccount = {
            email: emails[0].value,
            facebook_id: id,
            name: name.givenName
        }

        return user;
    }
}