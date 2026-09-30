export type CategoryFilter = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  label: string;
  // Ab UI mein use nahi hota (Explore ab emoji nahi dikhata); page headers
  // abhi bhi kar sakte hain
  emoji: string;
  // Optional background photo — na ho to card generated art dikhata hai
  imageUrl?: string | null;
  color: string;
  filter: string;
};
