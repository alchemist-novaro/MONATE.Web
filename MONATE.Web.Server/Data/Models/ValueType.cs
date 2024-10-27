namespace MONATE.Web.Server.Data.Models
{
    public class ValueType
    {
        public int Id { get; set; }
        public string Type { get; set; }

        public ICollection<InputValue> InputValues { get; set; }
        public ICollection<OutputValue> OutputValues { get; set; }
    }
}
