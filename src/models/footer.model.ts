export interface FooterDto {
  address: AddressDto;
  services: string[];
  social: SocialDto[];
  copyright: string;
}

export interface AddressDto {
  title: string;
  lines: string[];
  phone: PhoneDto;
}

export interface PhoneDto {
  landline: string;
  mobile: string;
}

export interface SocialDto {
  icon: string;
  link: string;
}
