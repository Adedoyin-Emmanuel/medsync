"use client";
import HospitalCard from "@/app/components/HospitalCard";
import { LoaderSmall } from "@/app/components/Loader";
import SidebarLayout from "@/app/components/SidebarLayout";
import Text from "@/app/components/Text";
import {
  clearHospitalSearchInfo,
  saveHospitalSearchInfo,
  useSearchHospitalQuery,
} from "@/app/store/slices/user.slice";
import { AppDispatch, useAppSelector } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Seo from "@/app/components/Seo/Seo";

const NewAppointment = () => {
  const [formData, setFormData] = useState({
    hospitalName: "caresync",
  });

  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useSearchHospitalQuery(formData.hospitalName);
  const [showData, setShowData] = useState<boolean>(false);
  const { hospitalSearchInfo } = useAppSelector((state) => state.user);
  const [responseLength, setResponseLength] = useState<number>(0);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement> | any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    dispatch(clearHospitalSearchInfo({}));
    if (data) {
      dispatch(saveHospitalSearchInfo(data.data));
      setResponseLength(data.data.length);
      setShowData(true);
    }
  }, [formData, data]);

  return (
    <>
      <Seo
        title="Create appointment"
        description="Create a new appointment with a hospital"
        keywords="create appointments, schedule appointments"
      />
      <div className="w-screen h-screen bg-zinc-50">
        <SidebarLayout>
          <section className="new-appointment">
            <h3 className="font-bold text-2xl capitalize text-accent">
              New appointment
            </h3>
            <Text className="text-sm">
              Find an hospital to submit appointment request to
            </Text>

            <section className="hospitals">
              <section className="flex items-center justify-center mt-5">
                <input
                  type="text"
                  placeholder="Search hospitals"
                  name="hospitalName"
                  className="bg-[#F5F5F5] capitalize p-5 rounded-full w-11/12 lg:w-8/12  outline-none border-2 border-purple-300 focus:border-accent hover:border-accent transition-all duration-150 ease-in my-5 text-sm"
                  onChange={handleInputChange}
                  value={formData.hospitalName}
                ></input>
              </section>

              <section className="found-hospitals w-full">
                {!isLoading && showData && (
                  <Text className={`text-center text-sm`}>
                    search result for{" "}
                    <span className="text-accent">{formData.hospitalName}</span>
                  </Text>
                )}
              </section>

              <section
                className={`all-hospitals w-full items-center  mx-auto gap-10 ${
                  responseLength !== 0 && "grid"
                } sm:grid-cols-2 xl:grid-cols-3 my-8`}
              >
                {isLoading ? (
                  <LoaderSmall />
                ) : responseLength == 0 ? (
                  <Text className="text-center my-5">No hospitals found</Text>
                ) : (
                  hospitalSearchInfo?.map((hospital) => {
                    return (
                      <HospitalCard
                        _id={hospital._id}
                        address={"Lagos 9ja"}
                        clinicName={hospital.clinicName}
                        isVerified={hospital.isVerified}
                        key={hospital._id}
                        href={`/user/appointments/new/${hospital._id}`}
                      />
                    );
                  })
                )}
              </section>
            </section>
          </section>
        </SidebarLayout>
      </div>
    </>
  );
};

export default NewAppointment;
