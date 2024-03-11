using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>()
                .ForMember(a => a.Id, a => a.Ignore());
        }
    }
}