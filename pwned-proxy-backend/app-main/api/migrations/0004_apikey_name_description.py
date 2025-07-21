from django.db import migrations, models


def set_default_names(apps, schema_editor):
    APIKey = apps.get_model('api', 'APIKey')
    for obj in APIKey.objects.all():
        if not obj.name:
            obj.name = f"Key for {obj.group.name if obj.group_id else obj.pk}"
            obj.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_apikey_plaintext'),
        ('api', '0003_apikey_group_required'),
    ]

    operations = [
        migrations.AddField(
            model_name='apikey',
            name='name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='apikey',
            name='description',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.RunPython(set_default_names, migrations.RunPython.noop),
    ]
