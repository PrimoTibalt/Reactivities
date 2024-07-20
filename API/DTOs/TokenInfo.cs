using System.Text.Json.Serialization;

namespace API.DTOs
{
    public class TokenInfo
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("aud")]
        public string Aud { get; set; }

        [JsonPropertyName("picture")]
        public string Picture { get; set; }

        [JsonPropertyName("given_name")]
        public string GivenName { get; set; }

        [JsonPropertyName("family_name")]
        public string FamilyName { get; set; }
    }
}