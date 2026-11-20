namespace Expose.Data;


public interface IEntityFromModel<out TSelf, in TModel>
    where TSelf : IEntityFromModel<TSelf, TModel>
{
    static abstract TSelf FromModel(TModel model);
}
