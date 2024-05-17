using Application.Activities;
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
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(a =>
                    a.Attendees.FirstOrDefault(h => h.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(p => p.Image, s => s.MapFrom(u => u.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, s => s.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}