import supabase from "./apis/supabase-client";

const test = async () => {
  const { data, error } = await supabase
    .from("performance_list")
    .select()
    .eq("mt20id", { _text: "PF248820" })
    .single();
  
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
};

test();